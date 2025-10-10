import Constants from "expo-constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categorias = ["Panadería", "Pastelería", "Empanadas"];

export default function IdentityCreatorScreen() {
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
    const router = useRouter();

    // Recibe lo de Address
    const { email, clientId, role, region, city, address } = useLocalSearchParams<{
        email?: string;
        clientId?: string;
        role?: string;
        region?: string;
        city?: string;
        address?: string;
    }>();

    const [businessName, setBusinessName] = useState("");
    const [category, setCategory] = useState<string>("");
    const [openCategory, setOpenCategory] = useState(false);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const canSubmit = !!businessName.trim() && !!address?.toString().trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;
        try {
            setErr(null);
            setLoading(true);

            const payload: Record<string, any> = {
                name: businessName.trim(),
                address: (address || "").toString().trim(),
                clientId: clientId ? Number(clientId) : undefined,
                ...(region ? { region } : {}),
                ...(city ? { city } : {}),
                ...(category ? { category } : {}),
            };

            const res = await fetch(`${API_BASE_URL}/api/stores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message ?? "No fue posible guardar los datos del emprendimiento.");

            const storeId = (data?.storeId ?? data?.id)?.toString();
            if (!storeId) throw new Error("No se recibió storeId desde el backend.");

            router.replace({
                pathname: "/creator/creator-dashboard",
                params: { name: businessName.trim(), address: payload.address, storeId },
            });
        } catch (e: any) {
            setErr(e?.message ?? "Ocurrió un error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header (igual patrón que form-creator.tsx) */}
            <View className="p-6">
                <Pressable
                    onPress={() => router.back()}
                    className="inline-flex h-10 w-10 items-center justify-center"
                    accessibilityLabel="Volver"
                    accessibilityRole="button"
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </Pressable>
            </View>

            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="w-full max-w-md self-center">
                        {/* Icono + títulos (alineado al estilo base) */}
                        <View className="mb-8 items-center">
                            <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                                <MaterialCommunityIcons name="storefront-outline" size={64} color="#db5a26" />
                            </View>

                            <Text className="mb-3 text-center text-3xl font-semibold text-gray-900">
                                Identidad del emprendimiento
                            </Text>

                            <Text className="text-center text-base text-gray-800">
                                Define cómo se mostrará tu negocio y su categoría principal
                            </Text>
                        </View>

                        {/* Nombre */}
                        <Text className="mb-2 text-base font-semibold text-gray-900">Nombre del emprendimiento</Text>
                        <TextInput
                            value={businessName}
                            onChangeText={setBusinessName}
                            placeholder="Mi cocina casera"
                            placeholderTextColor="#9CA3AF"
                            className="mb-6 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                            returnKeyType="next"
                        />

                        {/* Categoría (selector simple, sin gradiente) */}
                        <Text className="mb-2 text-base font-semibold text-gray-900">Categoría</Text>
                        <Pressable
                            onPress={() => setOpenCategory(true)}
                            className="mb-6 h-14 flex-row items-center justify-between rounded-3xl bg-gray-100 px-6"
                            accessibilityRole="button"
                        >
                            <Text className={`text-base ${category ? "text-gray-900" : "text-gray-500"}`}>
                                {category || "Selecciona una categoría"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#6B7280" />
                        </Pressable>

                        {/* Resumen dirección (solo lectura) */}
                        <View className="mb-8 flex-row items-start gap-3 rounded-2xl bg-gray-100 p-4">
                            <Ionicons name="location-outline" size={20} color="#db5a26" />
                            <Text className="flex-1 text-base text-gray-700">
                                {region ? `${region} • ` : ""}{city ? `${city} • ` : ""}{address || "Dirección no establecida"}
                            </Text>
                        </View>

                        {/* Error */}
                        {!!err && <Text className="mb-3 text-center text-sm text-red-600">{err}</Text>}

                        {/* CTA */}
                        <Pressable
                            onPress={handleSubmit}
                            disabled={!canSubmit || loading}
                            className={`mt-2 h-14 w-full items-center justify-center rounded-3xl ${!canSubmit || loading ? "bg-orange-300" : "bg-orange-600 active:opacity-90"
                                }`}
                            accessibilityRole="button"
                        >
                            {loading ? (
                                <View className="flex-row items-center gap-2">
                                    <ActivityIndicator color="#fff" />
                                    <Text className="text-lg font-medium text-white">Guardando…</Text>
                                </View>
                            ) : (
                                <Text className="text-lg font-medium text-white">Guardar y continuar</Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAL Categoría */}
            <Modal visible={openCategory} transparent animationType="fade" onRequestClose={() => setOpenCategory(false)}>
                <Pressable onPress={() => setOpenCategory(false)} className="flex-1 items-center justify-end bg-black/40">
                    <View className="w-full items-center">
                        <View className="w-full max-w-md rounded-t-3xl bg-white p-4">
                            <View className="mb-2 items-center">
                                <View className="h-1 w-12 rounded-full bg-gray-300" />
                            </View>
                            {categorias.map((opt) => (
                                <Pressable
                                    key={opt}
                                    onPress={() => {
                                        setCategory(opt);
                                        setOpenCategory(false);
                                    }}
                                    className="rounded-xl px-2 py-3 active:bg-gray-100"
                                >
                                    <Text className="text-base text-gray-900">{opt}</Text>
                                </Pressable>
                            ))}
                            <Pressable
                                onPress={() => setOpenCategory(false)}
                                className="mt-2 h-12 items-center justify-center rounded-2xl bg-gray-100"
                            >
                                <Text className="text-base text-gray-800">Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
