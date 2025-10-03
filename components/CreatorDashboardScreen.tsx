import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DashboardViewProps = {
    onPublish?: () => void;
};

export default function CreatorDashboardScreen({ onPublish }: DashboardViewProps) {
    const { name, address } = useLocalSearchParams<{ name?: string; address?: string }>();
    const title = (name ?? "Mi cocina casera").toString();
    const subtitle = (address ?? "Providencia, Santiago").toString();

    const progress = 42; // porcentaje de avance de ejemplo

    return (
        <SafeAreaView className="flex-1 bg-[#FFFAF2]">
            {/* Header con gradiente y bordes redondeados inferiores */}
            <LinearGradient
                colors={["#FF8A3D", "#FF6A00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-b-3xl px-5 pt-6 pb-8"
            >
                <View className="mb-6 flex-row items-start justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
                            <Ionicons name="restaurant-outline" size={28} color="#fff" />
                        </View>
                        <View>
                            <Text className="text-[22px] font-semibold leading-tight text-white">
                                {title}
                            </Text>
                            <Text className="mt-0.5 text-[14px] text-white/80">{subtitle}</Text>
                        </View>
                    </View>

                    <Pressable className="h-10 w-10 items-center justify-center rounded-full active:bg-white/10">
                        <Ionicons name="menu-outline" size={24} color="#fff" />
                    </Pressable>
                </View>

                {/* Tarjeta de estadísticas dentro del header */}
                <View className="rounded-3xl bg-white/15 p-5">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="mb-2 text-[14px] text-white/90">Publicaciones activas</Text>
                            <Text className="text-[40px] font-bold leading-none text-white">1</Text>
                        </View>
                        <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
                            <Ionicons name="time-outline" size={28} color="#fff" />
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Body responsive (rellena todo el ancho con padding lateral) */}
            <View className="flex-1 px-5 pt-8">
                <Text className="mb-5 text-[20px] font-semibold text-gray-900">Mis publicaciones</Text>

                {/* Card de publicación */}
                <View
                    className="rounded-3xl bg-white p-5"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 12,
                        elevation: 3,
                    }}
                >
                    <View className="mb-3 flex-row items-start justify-between">
                        <Text className="text-[17px] font-semibold text-gray-900">Pan amasado</Text>
                        <View className="rounded-full bg-[#FDE7D6] px-3 py-1.5">
                            <Text className="text-[13px] font-medium text-[#EA580C]">Activo</Text>
                        </View>
                    </View>

                    <View className="mb-4 flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={18} color="#6B7280" />
                        <Text className="text-[14px] text-[#6B7280]">Listo en 45 min</Text>
                    </View>

                    {/* Progress bar responsive (usa % del ancho disponible) */}
                    <View className="h-2 w-full overflow-hidden rounded-full bg-[#F8EDE3]">
                        <View
                            className="h-full rounded-full bg-[#EA580C]"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                </View>

                {/* FAB flotante (se posiciona relativo al viewport para todos los tamaños) */}
                <Pressable
                    onPress={onPublish}
                    className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-[#EA580C]"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 6 },
                        shadowRadius: 8,
                        elevation: 6,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Crear publicación"
                >
                    <Text className="text-[28px] leading-none text-white">+</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
