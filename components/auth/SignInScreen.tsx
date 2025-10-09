import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";

export default function SignInScreen() {
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: "creator" | "consumer" }>();
    const roleLabel = role === "consumer" ? "Consumidor" : "Creador";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSubmit = async () => {
        setErr(null);

        if (!email.trim() || !password.trim()) {
            setErr("Ingresa tu email y contraseña.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/public/verification/sign-in`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim(),
                    role: role === "consumer" ? "CONSUMER" : "CREATOR"
                }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                // Puedes leer el body para mensaje específico si tu backend lo envía:
                // const data = await res.json().catch(()=>null);
                // throw new Error(data?.message ?? "No fue posible iniciar sesión.");
                throw new Error("No fue posible iniciar sesión.");
            }
            const name = data?.name?.toString?.();
            const address = data?.address?.toString?.();
            const storeId = data?.storeId != null ? String(data.storeId) : undefined;

            if (!name || !address || !storeId) {
                throw new Error("La respuesta no contiene name, address o storeId.");
            }
            // Éxito → llevar al dashboard del creador            
            router.replace({
                pathname: "/creator/creator-dashboard",
                params: { name, address, storeId },
            });
        } catch (e: any) {
            setErr(e?.message ?? "Error al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Volver */}
            <View className="p-6">
                <Pressable
                    onPress={() => router.back()}
                    className="inline-flex h-10 w-10 items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel="Volver"
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </Pressable>
            </View>

            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View className="flex-1 items-center px-6 pt-2 pb-12">
                    <View className="w-full max-w-md items-center">
                        {/* Logo */}
                        <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                            <MaterialCommunityIcons name="chef-hat" size={64} color="#db5a26" />
                        </View>

                        {/* Marca */}
                        <Text className="mb-4 text-center text-4xl font-semibold text-orange-700">RecienHecho</Text>

                        {/* Subtítulo */}
                        <Text className="mb-8 text-center text-lg text-gray-800">Iniciar sesión como {roleLabel}</Text>

                        {/* Formulario */}
                        <View className="w-full">
                            <View className="mb-6">
                                <Text className="mb-2 text-base font-semibold text-gray-900">Email</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="tu@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="h-14 rounded-3xl border-0 bg-gray-100 px-4 text-base text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    returnKeyType="next"
                                />
                            </View>

                            <View className="mb-2">
                                <Text className="mb-2 text-base font-semibold text-gray-900">Contraseña</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    className="h-14 rounded-3xl border-0 bg-gray-100 px-4 text-base text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    returnKeyType="done"
                                />
                            </View>

                            {!!err && (
                                <Text className="mb-3 text-center text-sm text-red-600">
                                    {err}
                                </Text>
                            )}

                            <Pressable
                                onPress={handleSubmit}
                                disabled={loading}
                                className={`mt-2 h-14 items-center justify-center rounded-3xl ${loading ? "bg-orange-300" : "bg-orange-600 active:opacity-90"
                                    }`}
                                accessibilityRole="button"
                            >
                                {loading ? (
                                    <View className="flex-row items-center gap-2">
                                        <ActivityIndicator color="#fff" />
                                        <Text className="text-lg font-medium text-white">Ingresando…</Text>
                                    </View>
                                ) : (
                                    <Text className="text-lg font-medium text-white">Iniciar sesión</Text>
                                )}
                            </Pressable>
                        </View>

                        {/* Link a registro */}
                        <Pressable onPress={() => router.push("/sign-up")} className="mt-6" accessibilityRole="button">
                            <Text className="text-center text-base text-gray-500">
                                ¿No tienes cuenta? <Text className="text-gray-800 underline">Regístrate</Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
