import { API_BASE_URL } from "@env";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FormCreatorScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email?: string }>();

    const [businessName, setBusinessName] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSubmit = async () => {
        setErr(null);

        // Validaciones mínimas
        if (!businessName.trim() || !location.trim()) {
            setErr("Completa nombre y dirección para continuar.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/stores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: businessName.trim(),
                    address: location.trim(),
                }),
            });

            if (!res.ok) {
                // Puedes leer res.json() si tu backend retorna {message}
                throw new Error("No fue posible guardar los datos del emprendimiento.");
            }

            // Navegar al dashboard del Creador
            router.replace({
                pathname: "/creator-dashboard",
                params: {
                    name: businessName.trim(),
                    address: location.trim(),
                },
            });
        } catch (e: any) {
            setErr(e?.message ?? "Ocurrió un error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
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

            {/* Contenido */}
            <View className="flex-1 items-center px-6 pt-2 pb-12">
                <View className="w-full max-w-md">
                    {/* Icono superior */}
                    <View className="mb-8 items-center">
                        <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                            <MaterialCommunityIcons name="map-marker-outline" size={64} color="#db5a26" />
                        </View>

                        <Text className="mb-3 text-center text-3xl font-semibold text-gray-900">
                            Datos del emprendimiento
                        </Text>

                        <Text className="text-center text-base text-gray-800">
                            Esta información ayudará a los consumidores cercanos a encontrar tus productos
                        </Text>
                    </View>

                    {/* Formulario */}
                    <View>
                        <Text className="mb-2 text-base font-semibold text-gray-900">
                            Nombre del emprendimiento <Text className="font-normal text-gray-500">(opcional)</Text>
                        </Text>
                        <TextInput
                            value={businessName}
                            onChangeText={setBusinessName}
                            placeholder="Mi cocina casera"
                            placeholderTextColor="#9CA3AF"
                            className="mb-6 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                        />

                        <Text className="mb-2 text-base font-semibold text-gray-900">
                            Dirección o ubicación aproximada
                        </Text>
                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Ej: Providencia, Santiago"
                            placeholderTextColor="#9CA3AF"
                            className="mb-6 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                        />

                        <View className="mb-8 flex-row items-start gap-3 rounded-2xl bg-gray-100 p-4">
                            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#db5a26" />
                            <Text className="flex-1 text-base text-gray-700">
                                Tu ubicación se mostrará de forma aproximada a los consumidores para proteger tu privacidad.
                            </Text>
                        </View>

                        {/* Error */}
                        {!!err && (
                            <Text className="mb-3 text-center text-sm text-red-600">
                                {err}
                            </Text>
                        )}

                        {/* CTA */}
                        <Pressable
                            onPress={handleSubmit}
                            disabled={loading}
                            accessibilityRole="button"
                            className={`mt-2 h-14 w-full items-center justify-center rounded-3xl ${loading ? "bg-orange-300" : "bg-orange-600 active:opacity-90"
                                }`}
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
                </View>
            </View>
        </SafeAreaView>
    );
}
