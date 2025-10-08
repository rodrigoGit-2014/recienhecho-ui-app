import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";

export default function RegisterCreatorScreen() {
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        console.log("[RN] Registration attempt:", { name, email });

        try {
            console.log("rod")
            console.log(`${API_BASE_URL}`)
            const response = await fetch(`${API_BASE_URL}/api/public/verification/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la creación de cuenta:", errorText);
                alert("Ocurrió un error al crear la cuenta. Inténtalo de nuevo.");
                return;
            }

            const data = await response.json();
            console.log("✅ Respuesta backend:", data);

            // ⚠️ Aquí se asume que el backend responde con { verificationId: "..." }
            const verificationId = data.verificationId;
            const clientId = data.clientId;

            if (!verificationId || !clientId) {
                console.error("No se recibió verificationId del backend.");
                alert("No se pudo iniciar la verificación. Contacta soporte.");
                return;
            }

            // ✅ Redirigir a la pantalla de OTP con email y verificationId
            router.push({
                pathname: "/auth/otp-verification",
                params: { email, verificationId, clientId: clientId.toString() },
            });
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor. Verifica tu conexión.");
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

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="flex-1 items-center px-6 pt-2 pb-12">
                    <View className="w-full max-w-md items-center">
                        {/* Logo */}
                        <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                            <MaterialCommunityIcons name="chef-hat" size={64} color="#db5a26" />
                        </View>

                        {/* Marca */}
                        <Text className="mb-4 text-center text-4xl font-semibold text-orange-700">
                            RecienHecho
                        </Text>

                        {/* Subtítulo */}
                        <Text className="mb-12 text-center text-lg text-gray-800">
                            Crear cuenta como Creador
                        </Text>

                        {/* Formulario */}
                        <View className="w-full">
                            {/* Nombre */}
                            <View className="mb-6">
                                <Text className="mb-2 text-base font-semibold text-gray-900">Nombre</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Tu nombre"
                                    className="h-14 rounded-3xl border-0 bg-gray-100 px-4 text-base text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                />
                            </View>

                            {/* Email */}
                            <View className="mb-6">
                                <Text className="mb-2 text-base font-semibold text-gray-900">Email</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="tu@email.com"
                                    className="h-14 rounded-3xl border-0 bg-gray-100 px-4 text-base text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                />
                            </View>

                            {/* Contraseña */}
                            <View className="mb-6">
                                <Text className="mb-2 text-base font-semibold text-gray-900">Contraseña</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    className="h-14 rounded-3xl border-0 bg-gray-100 px-4 text-base text-gray-900"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                            </View>

                            {/* Botón crear cuenta */}
                            <Pressable
                                onPress={handleSubmit}
                                className="mt-2 h-14 items-center justify-center rounded-3xl bg-orange-600 active:opacity-90"
                                accessibilityRole="button"
                            >
                                <Text className="text-lg font-medium text-white">Crear cuenta</Text>
                            </Pressable>
                        </View>

                        {/* Link a login */}
                        <Pressable
                            onPress={() => router.push("/auth/sign-in")}
                            className="mt-6"
                            accessibilityRole="button"
                        >
                            <Text className="text-center text-base text-gray-500">
                                ¿Ya tienes cuenta?{" "}
                                <Text className="text-gray-800 underline">Inicia sesión</Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
