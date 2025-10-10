import Constants from "expo-constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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

/** Regiones y ciudades de Chile (resumen – puedes ampliar la lista) */
const regionesYCiudades: Record<string, string[]> = {
    "Región de Arica y Parinacota": ["Arica", "Putre", "Camarones"],
    "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"],
    "Región de Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal"],
    "Región de Atacama": ["Copiapó", "Vallenar", "Caldera", "Chañaral"],
    "Región de Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"],
    "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota"],
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Las Condes", "Providencia", "Ñuñoa"],
    "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "San Fernando", "Pichilemu", "Rengo"],
    "Región del Maule": ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes"],
    "Región de Ñuble": ["Chillán", "Bulnes", "San Carlos", "Quirihue"],
    "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante", "Coronel"],
    "Región de La Araucanía": ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"],
    "Región de Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"],
    "Región de Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas"],
    "Región de Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico"],
    "Región de Magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir"],
};

const categorias = ["Panadería", "Pastelería", "Empanadas"];

export default function FormCreatorScreen() {
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
    const router = useRouter();
    const { email, clientId } = useLocalSearchParams<{ email?: string; clientId?: string }>();

    // 👇 Mantengo estados originales y agrego nuevos
    const [businessName, setBusinessName] = useState("");
    const [address, setAddress] = useState(""); // reemplaza a "location" (mismo uso)
    const [category, setCategory] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const [city, setCity] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Modales para selects
    const [openCategory, setOpenCategory] = useState(false);
    const [openRegion, setOpenRegion] = useState(false);
    const [openCity, setOpenCity] = useState(false);

    const availableCities = useMemo(() => {
        return region ? regionesYCiudades[region] || [] : [];
    }, [region]);

    const handlePickRegion = (value: string) => {
        setRegion(value);
        setCity("");
        setOpenRegion(false);
    };

    // 🧠 LÓGICA DE SUBMIT (misma que ya tenías, extendida con nuevos campos)
    const handleSubmit = async () => {
        setErr(null);

        // ✅ Mantenemos validación original: nombre y dirección requeridos
        if (!businessName.trim() || !address.trim()) {
            setErr("Completa nombre y dirección para continuar.");
            return;
        }

        try {
            setLoading(true);

            // Construir payload (enviamos nuevos campos si están seteados)
            const payload: Record<string, any> = {
                name: businessName.trim(),
                address: address.trim(),
                clientId: clientId ? Number(clientId) : undefined,
            };
            if (category) payload.category = category;
            if (region) payload.region = region;
            if (city) payload.city = city;

            const res = await fetch(`${API_BASE_URL}/api/stores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.message ?? "No fue posible guardar los datos del emprendimiento.");
            }
            // Compatibilidad: algunos backends responden { storeId }, otros { id }
            const storeId = (data?.storeId ?? data?.id)?.toString();
            if (!storeId) {
                throw new Error("No se recibió storeId desde el backend.");
            }

            // Navegar al dashboard del Creador (mismo flujo que tenías)
            router.replace({
                pathname: "/creator/creator-dashboard",
                params: {
                    name: businessName.trim(),
                    address: address.trim(),
                    storeId,
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

            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 8 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Contenedor centrado (patrón unificado con la app) */}
                    <View className="w-full max-w-md self-center">
                        {/* Hero / Títulos */}
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
                            {/* Nombre (opcional) */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">
                                Nombre del emprendimiento <Text className="font-normal text-gray-500">(opcional)</Text>
                            </Text>
                            <TextInput
                                value={businessName}
                                onChangeText={setBusinessName}
                                placeholder="Mi cocina casera"
                                placeholderTextColor="#9CA3AF"
                                className="mb-6 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                                returnKeyType="next"
                            />

                            {/* Categoría */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">Categoría</Text>
                            <Pressable
                                onPress={() => setOpenCategory(true)}
                                className="mb-6 h-14 flex-row items-center justify-between rounded-3xl bg-gray-100 px-6"
                            >
                                <Text className={`text-base ${category ? "text-gray-900" : "text-gray-500"}`}>
                                    {category || "Selecciona una categoría"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6B7280" />
                            </Pressable>

                            {/* Separador */}
                            <View className="my-4 h-[1px] bg-gray-200" />

                            {/* Región */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">Región</Text>
                            <Pressable
                                onPress={() => setOpenRegion(true)}
                                className="mb-6 h-14 flex-row items-center justify-between rounded-3xl bg-gray-100 px-6"
                            >
                                <Text className={`text-base ${region ? "text-gray-900" : "text-gray-500"}`}>
                                    {region || "Selecciona"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6B7280" />
                            </Pressable>

                            {/* Ciudad */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">Ciudad</Text>
                            <Pressable
                                disabled={!region}
                                onPress={() => setOpenCity(true)}
                                className={`mb-6 h-14 flex-row items-center justify-between rounded-3xl px-6 ${region ? "bg-gray-100" : "bg-gray-100 opacity-60"
                                    }`}
                            >
                                <Text className={`text-base ${city ? "text-gray-900" : "text-gray-500"}`}>
                                    {region ? city || "Selecciona" : "Primero región"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#6B7280" />
                            </Pressable>

                            {/* Dirección */}
                            <Text className="mb-2 text-base font-semibold text-gray-900">Dirección o ubicación aproximada</Text>
                            <TextInput
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Ej: Providencia, Santiago"
                                placeholderTextColor="#9CA3AF"
                                className="mb-6 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                                returnKeyType="done"
                            />

                            {/* Info box */}
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
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal: Categoría */}
            <Modal visible={openCategory} transparent animationType="fade" onRequestClose={() => setOpenCategory(false)}>
                <Pressable onPress={() => setOpenCategory(false)} className="flex-1 items-center justify-end bg-black/40">
                    <View className="w-full items-center">
                        <View className="w-full max-w-md rounded-t-3xl bg-white p-4">
                            <View className="mb-2 items-center">
                                <View className="h-1 w-12 rounded-full bg-gray-300" />
                            </View>

                            {categorias.map((opt) => (
                                <Pressable
                                    key={opt}
                                    onPress={() => {
                                        setCategory(opt);
                                        setOpenCategory(false);
                                    }}
                                    className="rounded-xl px-2 py-3 active:bg-gray-100"
                                >
                                    <Text className="text-base text-gray-900">{opt}</Text>
                                </Pressable>
                            ))}

                            <Pressable onPress={() => setOpenCategory(false)} className="mt-2 h-12 items-center justify-center rounded-2xl bg-gray-100">
                                <Text className="text-base text-gray-800">Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* Modal: Región */}
            <Modal visible={openRegion} transparent animationType="fade" onRequestClose={() => setOpenRegion(false)}>
                <Pressable onPress={() => setOpenRegion(false)} className="flex-1 items-center justify-end bg-black/40">
                    <View className="w-full items-center">
                        <View className="w-full max-w-md rounded-t-3xl bg-white p-4">
                            <View className="mb-2 items-center">
                                <View className="h-1 w-12 rounded-full bg-gray-300" />
                            </View>

                            {Object.keys(regionesYCiudades).map((reg) => (
                                <Pressable
                                    key={reg}
                                    onPress={() => handlePickRegion(reg)}
                                    className="rounded-xl px-2 py-3 active:bg-gray-100"
                                >
                                    <Text className="text-base text-gray-900">{reg}</Text>
                                </Pressable>
                            ))}

                            <Pressable onPress={() => setOpenRegion(false)} className="mt-2 h-12 items-center justify-center rounded-2xl bg-gray-100">
                                <Text className="text-base text-gray-800">Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* Modal: Ciudad */}
            <Modal visible={openCity} transparent animationType="fade" onRequestClose={() => setOpenCity(false)}>
                <Pressable onPress={() => setOpenCity(false)} className="flex-1 items-center justify-end bg-black/40">
                    <View className="w-full items-center">
                        <View className="w-full max-w-md rounded-t-3xl bg-white p-4">
                            <View className="mb-2 items-center">
                                <View className="h-1 w-12 rounded-full bg-gray-300" />
                            </View>

                            {availableCities.map((ct) => (
                                <Pressable
                                    key={ct}
                                    onPress={() => {
                                        setCity(ct);
                                        setOpenCity(false);
                                    }}
                                    className="rounded-xl px-2 py-3 active:bg-gray-100"
                                >
                                    <Text className="text-base text-gray-900">{ct}</Text>
                                </Pressable>
                            ))}

                            <Pressable onPress={() => setOpenCity(false)} className="mt-2 h-12 items-center justify-center rounded-2xl bg-gray-100">
                                <Text className="text-base text-gray-800">Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
