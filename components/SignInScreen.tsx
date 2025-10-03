import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        console.log("[RN] Login attempt:", { email });
        // TODO: Agregar lógica real de autenticación
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
                            Iniciar sesión como Creador
                        </Text>

                        {/* Formulario */}
                        <View className="w-full">
                            {/* Email */}
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

                            {/* Contraseña */}
                            <View className="mb-6">
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

                            {/* Botón iniciar sesión */}
                            <Pressable
                                onPress={handleSubmit}
                                className="mt-2 h-14 items-center justify-center rounded-3xl bg-orange-600 active:opacity-90"
                                accessibilityRole="button"
                            >
                                <Text className="text-lg font-medium text-white">Iniciar sesión</Text>
                            </Pressable>
                        </View>

                        {/* Link a registro (mismo estilo de enlace simple) */}
                        <Pressable
                            onPress={() => router.push("/register-creator")}
                            className="mt-6"
                            accessibilityRole="button"
                        >
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
