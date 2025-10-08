import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AccountVerifiedScreen() {
    const router = useRouter();
    const { email, clientId } = useLocalSearchParams<{ email?: string; clientId?: string }>();

    const goBack = () => router.back();
    const goToLocation = () =>
        router.push({
            pathname: "/creator/form-creator",
            params: { email, clientId: clientId?.toString() },
        });
    const goToDashboard = () => router.push("/(creator)/dashboard");

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Back (mismo header que OTP) */}
            <View className="p-6">
                <Pressable
                    onPress={goBack}
                    className="inline-flex h-10 w-10 items-center justify-center"
                    accessibilityLabel="Volver"
                    accessibilityRole="button"
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </Pressable>
            </View>

            {/* Contenido central alineado al estilo de OTP */}
            <View className="flex-1 items-center px-6 pt-2 pb-12">
                <View className="w-full max-w-md items-center">
                    {/* Hero de éxito */}
                    <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-green-50">
                        <Ionicons name="checkmark-circle" size={96} color="#16a34a" />
                    </View>

                    {/* Marca */}
                    <Text className="mb-4 text-center text-4xl font-semibold text-orange-700">RecienHecho</Text>

                    {/* Título */}
                    <Text className="mb-6 text-center text-3xl font-bold text-green-600">¡Cuenta verificada!</Text>

                    {/* Descripción */}
                    <Text className="mb-8 text-center text-base text-gray-800">
                        Ya validamos tu correo{" "}
                        <Text className="font-medium text-gray-900">{email || "tu-email@dominio.com"}</Text>. Ahora
                        configura la ubicación de tu emprendimiento para que los consumidores puedan encontrarte por
                        cercanía.
                    </Text>

                    {/* CTA principal */}
                    <Pressable
                        onPress={goToLocation}
                        className="mt-2 h-14 w-full items-center justify-center rounded-3xl bg-orange-600 active:opacity-90"
                        accessibilityRole="button"
                    >
                        <Text className="text-lg font-medium text-white">Configurar ubicación</Text>
                    </Pressable>

                    {/* CTA secundaria */}
                    <Pressable
                        onPress={goToDashboard}
                        className="mt-4 h-14 w-full items-center justify-center rounded-3xl border-2 border-orange-200 bg-white active:opacity-90"
                        accessibilityRole="button"
                    >
                        <Text className="text-lg font-medium text-gray-900">Ir al panel</Text>
                    </Pressable>

                    {/* Indicador */}
                    <Text className="mt-8 text-center text-sm text-gray-500">
                        Paso 2 de 3 · Verificación completada
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
