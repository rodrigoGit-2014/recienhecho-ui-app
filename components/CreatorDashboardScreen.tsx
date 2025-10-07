// components/CreatorDashboardScreen.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Constants from "expo-constants";

type Batch = {
    id: number;
    store: { id: number; name: string; address: string };
    product: string;
    readyAt: string; // ISO
    quantity: number;
    status: string; // e.g. "READY"
    notified: boolean;
    createdAt: string;
};

function formatEta(readyAtISO: string) {
    const ready = new Date(readyAtISO);
    const now = new Date();
    if (isNaN(ready.getTime())) return "Horario no disponible";

    const diffMs = ready.getTime() - now.getTime(); // > 0: en el futuro
    const absMin = Math.ceil(Math.abs(diffMs) / 60000);
    const h = Math.floor(absMin / 60);
    const m = absMin % 60;
    const hm = h > 0 ? `${h} h${m ? ` ${m} min` : ""}` : `${m} min`;

    if (diffMs > 60000) return `Listo en ${hm}`;
    if (diffMs >= -60000) return "Listo ahora";
    return `Listo hace ${hm}`;
}

export default function CreatorDashboardScreen() {
    const router = useRouter();
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
    const { name, address, storeId } = useLocalSearchParams<{
        name?: string;
        address?: string;
        storeId?: string;
    }>();

    const sid = (storeId ?? "3").toString();

    // Fallback de nombre/dirección cuando no vienen por params
    const [storeName, setStoreName] = useState<string | undefined>(undefined);
    const [storeAddress, setStoreAddress] = useState<string | undefined>(undefined);

    // Publicaciones (batches)
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);


    const title =
        (name && `${name}`.trim())
            ? `${name}`
            : (storeName && storeName.trim())
                ? storeName
                : "Mi cocina casera";

    const subtitle =
        (address && `${address}`.trim())
            ? `${address}`
            : (storeAddress && storeAddress.trim())
                ? storeAddress
                : "Providencia, Santiago";

    // Cargar publicaciones READY
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const res = await fetch(`${API_BASE_URL}/api/stores/${sid}/batches`);
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.message ?? "No fue posible cargar publicaciones.");
                if (alive) setBatches(Array.isArray(data) ? data : []);
            } catch (e: any) {
                if (alive) setErr(e?.message ?? "Error al cargar publicaciones.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [API_BASE_URL, sid]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header con gradiente y bordes redondeados (wrapper con overflow-hidden para mobile) */}
            <View className="w-full rounded-b-3xl overflow-hidden  px-1 pt-1 ">
                <LinearGradient colors={["#FF8A3D", "#FF6A00"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    <View className="items-center px-6 pt-6 pb-8">
                        <View className="w-full max-w-md">
                            <View className="mb-6 flex-row items-start justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="h-14 w-14 items-center justify-center rounded-full bg-white/20">
                                        <Ionicons name="restaurant-outline" size={28} color="#fff" />
                                    </View>
                                    <View>
                                        <Text className="text-[22px] font-semibold leading-tight text-white">{title}</Text>
                                        <Text className="mt-0.5 text-[14px] text-white/80">{subtitle}</Text>
                                    </View>
                                </View>

                                <Pressable
                                    className="h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
                                    accessibilityRole="button"
                                    accessibilityLabel="Abrir menú"
                                >
                                    <Ionicons name="menu-outline" size={24} color="#fff" />
                                </Pressable>
                            </View>

                            <View className="rounded-3xl bg-white/15 p-5">
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="mb-2 text-[14px] text-white/90">Publicaciones activas</Text>
                                        <Text className="text-[40px] font-bold leading-none text-white">{batches.length}</Text>
                                    </View>
                                    <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                        <Ionicons name="time-outline" size={28} color="#fff" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Body centrado (mismo patrón w-full max-w-md) */}
            <View className="flex-1 items-center px-6 pt-8 pb-12">
                <View className="w-full max-w-md">
                    <Text className="mb-5 text-[20px] font-semibold text-gray-900">Mis publicaciones</Text>

                    {loading ? (
                        <View className="mt-6 items-center">
                            <ActivityIndicator />
                            <Text className="mt-3 text-gray-600">Cargando publicaciones…</Text>
                        </View>
                    ) : err ? (
                        <Text className="text-red-600">{err}</Text>
                    ) : batches.length === 0 ? (
                        <Text className="text-gray-600">No hay publicaciones READY por ahora.</Text>
                    ) : (
                        batches.map((batch) => (
                            <View
                                key={batch.id}
                                className="mb-5 rounded-3xl bg-white p-5"
                                style={{
                                    shadowColor: "#000",
                                    shadowOpacity: 0.08,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowRadius: 12,
                                    elevation: 3,
                                }}
                            >
                                <View className="mb-3 flex-row items-start justify-between">
                                    <Text className="text-[17px] font-semibold text-gray-900">{batch.product}</Text>
                                    <View className="rounded-full bg-[#FDE7D6] px-3 py-1.5">
                                        <Text className="text-[13px] font-medium text-[#EA580C]">{batch.status}</Text>
                                    </View>
                                </View>

                                <View className="mb-2 flex-row items-center gap-2">
                                    <Ionicons name="time-outline" size={18} color="#6B7280" />
                                    <Text className="text-[14px] text-[#6B7280]">{formatEta(batch.readyAt)}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* FAB: crear publicación -> PublishProduct, propagando storeId */}
                <Pressable
                    onPress={() => router.push({ pathname: "/publish-product", params: { storeId: sid, name: title, address: subtitle } })}
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
