import { Bell, ChefHat } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function OnboardingScreen() {
    const [selectedRole, setSelectedRole] = useState<"creator" | "consumer" | null>(null);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6 py-12">
                {/* Logo & Icono */}
                <View className="mb-8 items-center">
                    <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                        <ChefHat size={64} color="#ea580c" strokeWidth={2.5} />
                    </View>

                    {/* Marca */}
                    <Text className="mb-4 text-center text-4xl font-light tracking-tight text-orange-600">
                        RecienHecho
                    </Text>

                    {/* Tagline */}
                    <Text className="text-center text-base leading-relaxed text-gray-600">
                        Conectando sabores caseros con quienes los aprecian
                    </Text>
                </View>

                {/* Selección de rol */}
                <View className="w-full max-w-md">
                    <Text className="mb-6 text-center text-lg text-gray-700">
                        Elige cómo quieres usar la aplicación
                    </Text>

                    <View className="gap-4">
                        {/* Tarjeta Creador */}
                        <Pressable
                            onPress={() => setSelectedRole("creator")}
                            className="flex w-full flex-row items-center gap-4 rounded-3xl bg-orange-600 p-6 active:scale-95"
                        >
                            <View className="h-16 w-16 items-center justify-center rounded-full bg-orange-700">
                                <ChefHat size={32} color="#fff" strokeWidth={2} />
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-xl font-medium text-white">Soy Creador</Text>
                                <Text className="text-sm leading-relaxed text-orange-100">
                                    Quiero publicar mis productos
                                </Text>
                            </View>
                        </Pressable>

                        {/* Tarjeta Consumidor */}
                        <Pressable
                            onPress={() => setSelectedRole("consumer")}
                            className="flex w-full flex-row items-center gap-4 rounded-3xl border-2 border-orange-200 bg-white p-6 active:scale-95"
                        >
                            <View className="h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                                <Bell size={32} color="#ea580c" strokeWidth={2} />
                            </View>
                            <View className="flex-1">
                                <Text className="mb-1 text-xl font-medium text-gray-900">Soy Consumidor</Text>
                                <Text className="text-sm leading-relaxed text-gray-600">
                                    Quiero recibir notificaciones
                                </Text>
                            </View>
                        </Pressable>
                    </View>

                    {/* Estado seleccionado (opcional para debug/navegación futura) */}
                    {selectedRole && (
                        <Text className="mt-4 text-center text-sm text-gray-500">
                            Rol seleccionado: {selectedRole === "creator" ? "Creador" : "Consumidor"}
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
