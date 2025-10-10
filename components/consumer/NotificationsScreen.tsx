// components/ConsumerNotificationsScreen.tsx
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Category = "Todas" | "Panadería" | "Pastelería" | "Empanadas" | "Otro";
type Status = "Todos" | "En preparación" | "Listo" | "Finalizado";

type NotificationItem = {
    id: string;
    title: string;
    restaurant: string;
    status: "Listo" | "En preparación" | "Finalizado";
    location: string;
    time: string; // e.g. "Listo hace 5 min"
    isFavorite: boolean;
    category: Category;
};

// Mock inicial (luego reemplaza por fetch)
const mockNotifications: NotificationItem[] = [
    {
        id: "1",
        title: "Pan de masa madre",
        restaurant: "Mi Cocina Casera",
        status: "Listo",
        location: "Santiago Centro",
        time: "Listo hace 5 min",
        isFavorite: true,
        category: "Panadería",
    },
    {
        id: "2",
        title: "Empanadas de pino",
        restaurant: "Doña María",
        status: "En preparación",
        location: "Providencia",
        time: "Listo en 15 min",
        isFavorite: false,
        category: "Empanadas",
    },
    {
        id: "3",
        title: "Torta de chocolate",
        restaurant: "Dulce Tentación",
        status: "Listo",
        location: "Las Condes",
        time: "Listo hace 10 min",
        isFavorite: true,
        category: "Pastelería",
    },
];

export default function NotificationsScreen() {
    const [selectedCategory, setSelectedCategory] = useState<Category>("Todas");
    const [selectedStatus, setSelectedStatus] = useState<Status>("Todos");
    const [activeTab, setActiveTab] = useState<
        "inicio" | "suscripciones" | "notificaciones" | "perfil"
    >("notificaciones");
    const [items, setItems] = useState<NotificationItem[]>(mockNotifications);
    const [loading] = useState(false);

    const categories: Category[] = ["Todas", "Panadería", "Pastelería", "Empanadas", "Otro"];
    const statuses: Status[] = ["Todos", "En preparación", "Listo", "Finalizado"];

    const filtered = useMemo(() => {
        return items.filter((n) => {
            const byCat = selectedCategory === "Todas" || n.category === selectedCategory;
            const byStatus = selectedStatus === "Todos" || n.status === selectedStatus;
            return byCat && byStatus;
        });
    }, [items, selectedCategory, selectedStatus]);

    const toggleFav = (id: string) => {
        setItems((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header (estilo unificado con CreatorDashboard) */}
            <View className="w-full overflow-hidden rounded-b-3xl">
                <LinearGradient colors={["#FF8A3D", "#FF6A00"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                    <View className="items-center px-6 pt-6 pb-8">
                        <View className="w-full max-w-md">
                            <View className="mb-6 flex-row items-center justify-between">
                                <Pressable
                                    className="h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
                                    accessibilityRole="button"
                                    accessibilityLabel="Abrir notificaciones"
                                >
                                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                                </Pressable>
                                <Text className="text-[22px] font-semibold leading-tight text-white">
                                    Mis Notificaciones
                                </Text>
                                <Pressable
                                    className="h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
                                    accessibilityRole="button"
                                    accessibilityLabel="Buscar"
                                >
                                    <Ionicons name="search-outline" size={24} color="#fff" />
                                </Pressable>
                            </View>

                            {/* Resumen superior (opcional) */}
                            <View className="rounded-3xl bg-white/15 p-5">
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="mb-2 text-[14px] text-white/90">Notificaciones hoy</Text>
                                        <Text className="text-[40px] font-bold leading-none text-white">
                                            {filtered.length}
                                        </Text>
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

            {/* Contenido: filtros + lista scrollable */}
            <View className="flex-1 pt-6">
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                    ListHeaderComponent={
                        <View className="w-full max-w-md self-center">
                            {/* Filtros */}
                            <View className="mb-6">
                                <Text className="mb-3 text-[18px] font-semibold text-gray-900">Categoría</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-1">
                                    <View className="flex-row items-center gap-2">
                                        {categories.map((c) => (
                                            <Pressable
                                                key={c}
                                                onPress={() => setSelectedCategory(c)}
                                                className={`rounded-full px-5 py-2 ${selectedCategory === c ? "bg-[#EA580C]" : "bg-gray-100"
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-sm font-medium ${selectedCategory === c ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    {c}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            <View className="mb-2">
                                <Text className="mb-3 text-[18px] font-semibold text-gray-900">Estado</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-1">
                                    <View className="flex-row items-center gap-2">
                                        {statuses.map((s) => (
                                            <Pressable
                                                key={s}
                                                onPress={() => setSelectedStatus(s)}
                                                className={`rounded-full px-5 py-2 ${selectedStatus === s ? "bg-[#EA580C]" : "bg-gray-100"
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-sm font-medium ${selectedStatus === s ? "text-white" : "text-gray-800"
                                                        }`}
                                                >
                                                    {s}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Separador "Hoy" */}
                            <Text className="mt-6 mb-4 text-2xl font-semibold text-gray-900">Hoy</Text>

                            {/* Estados de carga/empty */}
                            {loading ? (
                                <View className="mt-4 items-center">
                                    <ActivityIndicator />
                                    <Text className="mt-3 text-gray-600">Cargando…</Text>
                                </View>
                            ) : filtered.length === 0 ? (
                                <Text className="text-gray-600">No hay notificaciones que coincidan con tu filtro.</Text>
                            ) : null}
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View className="w-full max-w-md self-center">
                            <View
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
                                    <View className="max-w-[80%]">
                                        <Text className="mb-1 text-[17px] font-semibold text-gray-900">
                                            {item.title}
                                        </Text>
                                        <Text className="mb-3 text-[13px] text-gray-500">{item.restaurant}</Text>
                                        {/* chip de estado (colores consistentes) */}
                                        <View
                                            className={`self-start rounded-full px-4 py-1 ${item.status === "Listo"
                                                    ? "bg-green-100"
                                                    : item.status === "En preparación"
                                                        ? "bg-yellow-100"
                                                        : "bg-gray-100"
                                                }`}
                                        >
                                            <Text
                                                className={`text-[13px] font-medium ${item.status === "Listo"
                                                        ? "text-green-700"
                                                        : item.status === "En preparación"
                                                            ? "text-yellow-700"
                                                            : "text-gray-600"
                                                    }`}
                                            >
                                                {item.status}
                                            </Text>
                                        </View>

                                        {/* meta */}
                                        <View className="mt-3 flex-row flex-wrap items-center gap-4">
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="location-outline" size={16} color="#6B7280" />
                                                <Text className="text-[13px] text-gray-600">{item.location}</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                                                <Text className="text-[13px] text-gray-600">{item.time}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* favorito */}
                                    <Pressable
                                        onPress={() => toggleFav(item.id)}
                                        className="ml-3 h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
                                        accessibilityLabel={item.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                        accessibilityRole="button"
                                    >
                                        <Ionicons
                                            name={item.isFavorite ? "heart" : "heart-outline"}
                                            size={22}
                                            color={item.isFavorite ? "#EA580C" : "#9CA3AF"}
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    )}
                />

                {/* Bottom Navigation (estático; puedes conectarlo a expo-router si quieres) */}
                <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
                    <View className="flex-row items-center justify-around px-4 py-3">
                        <Pressable
                            onPress={() => setActiveTab("inicio")}
                            className="items-center"
                            accessibilityRole="button"
                            accessibilityLabel="Inicio"
                        >
                            <Ionicons
                                name="home-outline"
                                size={24}
                                color={activeTab === "inicio" ? "#111827" : "#9CA3AF"}
                            />
                            <Text className={`text-xs font-medium ${activeTab === "inicio" ? "text-gray-900" : "text-gray-400"}`}>
                                Inicio
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setActiveTab("suscripciones")}
                            className="items-center"
                            accessibilityRole="button"
                            accessibilityLabel="Suscripciones"
                        >
                            <Ionicons
                                name="star-outline"
                                size={24}
                                color={activeTab === "suscripciones" ? "#111827" : "#9CA3AF"}
                            />
                            <Text className={`text-xs font-medium ${activeTab === "suscripciones" ? "text-gray-900" : "text-gray-400"}`}>
                                Suscripciones
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setActiveTab("notificaciones")}
                            className="items-center"
                            accessibilityRole="button"
                            accessibilityLabel="Notificaciones"
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={activeTab === "notificaciones" ? "#EA580C" : "#9CA3AF"}
                            />
                            <Text className="text-xs font-medium text-[#EA580C]">Notificaciones</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setActiveTab("perfil")}
                            className="items-center"
                            accessibilityRole="button"
                            accessibilityLabel="Perfil"
                        >
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={activeTab === "perfil" ? "#111827" : "#9CA3AF"}
                            />
                            <Text className={`text-xs font-medium ${activeTab === "perfil" ? "text-gray-900" : "text-gray-400"}`}>
                                Perfil
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
