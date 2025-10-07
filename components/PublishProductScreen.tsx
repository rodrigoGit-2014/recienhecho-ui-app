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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

export default function PublishProductScreen() {
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
    const router = useRouter();
    const { storeId, name, address } = useLocalSearchParams<{ storeId?: string; name?: string; address?: string }>();

    const sid = storeId?.toString();

    const [productName, setProductName] = useState("");
    const [timeMinutes, setTimeMinutes] = useState<number | null>(null);
    const [selectOpen, setSelectOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const timeOptions = [
        { value: 15, label: "15 minutos" },
        { value: 30, label: "30 minutos" },
        { value: 45, label: "45 minutos" },
        { value: 60, label: "1 hora" },
        { value: 90, label: "1.5 horas" },
        { value: 120, label: "2 horas" },
    ];

    const selectedLabel =
        timeOptions.find((o) => o.value === timeMinutes)?.label || "Selecciona el tiempo";

    const handleSubmit = async () => {
        setErr(null);
        if (!sid) {
            setErr("Falta storeId para publicar.");
            return;
        }
        if (!productName.trim() || !timeMinutes) {
            setErr("Completa el producto y el tiempo.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/api/stores/${sid}/batches`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productDesc: productName.trim(),
                    readyInMinutes: timeMinutes,
                    quantity: 0,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const msg = (data && data.message) || "No fue posible publicar el producto.";
                throw new Error(msg);
            }

            // Volver al dashboard con storeId para refrescar            
            router.replace({ pathname: "/creator-dashboard", params: { storeId: sid, name, address } });
        } catch (e: any) {
            setErr(e?.message ?? "Error al publicar.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header consistente con el resto de pantallas */}
            <View className="p-6">
                <Pressable
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Volver"
                    className="inline-flex h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </Pressable>
            </View>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 8 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Contenedor centrado (mismo patrón w-full max-w-md) */}
                    <View className="w-full max-w-md self-center">
                        {/* Icono y títulos (alineado con Form/Verified/OTP) */}
                        <View className="mb-8 items-center">
                            <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                                <MaterialCommunityIcons name="chef-hat" size={64} color="#db5a26" />
                            </View>

                            <Text className="mb-3 text-center text-3xl font-semibold text-gray-900">
                                Publicar producto
                            </Text>

                            <Text className="text-center text-base text-gray-800">
                                Los consumidores cercanos recibirán una notificación inmediatamente
                            </Text>
                        </View>

                        {/* Formulario (inputs bg-gray-100, radios 3xl, tipografía consistente) */}
                        <View>
                            {/* Nombre del producto */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">Nombre del producto</Text>
                            <TextInput
                                value={productName}
                                onChangeText={setProductName}
                                placeholder="Ej: Pan amasado, Torta de chocolate"
                                placeholderTextColor="#9CA3AF"
                                className="mb-2 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                                returnKeyType="next"
                            />
                            <Text className="mb-6 text-sm text-gray-600">
                                Describe tu producto de forma clara y atractiva.
                            </Text>

                            {/* Tiempo estimado */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">
                                Tiempo estimado hasta que esté listo
                            </Text>
                            <Pressable
                                onPress={() => setSelectOpen(true)}
                                accessibilityRole="button"
                                className="mb-6 h-14 flex-row items-center justify-between rounded-3xl bg-gray-100 px-6"
                            >
                                <Text className="text-base text-gray-700">{selectedLabel}</Text>
                                <Ionicons name="chevron-down" size={20} color="#6B7280" />
                            </Pressable>

                            {/* Aviso / ayuda */}
                            <View className="mb-8 flex-row items-start gap-3 rounded-2xl bg-gray-100 p-4">
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#db5a26" />
                                <Text className="flex-1 text-base text-gray-700">
                                    El tiempo se mostrará a los consumidores y se actualizará automáticamente.
                                    Asegúrate de que sea preciso.
                                </Text>
                            </View>

                            {/* Error */}
                            {!!err && (
                                <Text className="mb-3 text-center text-sm text-red-600">{err}</Text>
                            )}

                            {/* CTA coherente (bg-orange-600, rounded-3xl) */}
                            <Pressable
                                onPress={handleSubmit}
                                disabled={submitting || !productName.trim() || !timeMinutes}
                                className={`mt-2 h-14 w-full items-center justify-center rounded-3xl ${submitting ? "bg-orange-300" : "bg-orange-600 active:opacity-90"
                                    }`}
                                accessibilityRole="button"
                            >
                                {submitting ? (
                                    <View className="flex-row items-center gap-2">
                                        <ActivityIndicator color="#fff" />
                                        <Text className="text-lg font-medium text-white">Publicando…</Text>
                                    </View>
                                ) : (
                                    <Text className="text-lg font-medium text-white">Publicar</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal de selección (bottom sheet) con el mismo look & feel */}
            <Modal
                visible={selectOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectOpen(false)}
            >
                <Pressable
                    onPress={() => setSelectOpen(false)}
                    className="flex-1 items-center justify-end bg-black/40"
                >
                    {/* Contenedor para centrar el sheet y limitar ancho en web */}
                    <View className="w-full items-center">
                        <View className="w-full max-w-md rounded-t-3xl bg-white p-4">
                            <View className="mb-2 items-center">
                                <View className="h-1 w-12 rounded-full bg-gray-300" />
                            </View>

                            {timeOptions.map((opt) => (
                                <Pressable
                                    key={opt.value}
                                    onPress={() => {
                                        setTimeMinutes(opt.value);
                                        setSelectOpen(false);
                                    }}
                                    className="flex-row items-center justify-between rounded-xl px-2 py-3 active:bg-gray-100"
                                >
                                    <Text className="text-base text-gray-900">{opt.label}</Text>
                                    {timeMinutes === opt.value ? (
                                        <Ionicons name="checkmark" size={20} color="#EA580C" />
                                    ) : null}
                                </Pressable>
                            ))}

                            <Pressable
                                onPress={() => setSelectOpen(false)}
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
