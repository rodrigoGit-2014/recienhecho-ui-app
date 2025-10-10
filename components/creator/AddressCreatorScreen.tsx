import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

/** Regiones y ciudades de Chile (puedes ampliar) */
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

export default function AddressCreatorScreen() {
    const router = useRouter();
    const { email, clientId, role } = useLocalSearchParams<{ email?: string; clientId?: string; role?: string }>();

    const [region, setRegion] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    // Modales (selección)
    const [openRegion, setOpenRegion] = useState(false);
    const [openCity, setOpenCity] = useState(false);

    const availableCities = useMemo(() => (region ? regionesYCiudades[region] || [] : []), [region]);
    const handlePickRegion = (value: string) => {
        setRegion(value);
        setCity("");
        setOpenRegion(false);
    };

    const canContinue = !!region && !!city && !!address.trim();

    const goNext = () => {
        if (!canContinue) return;
        router.push({
            pathname: "/creator/form-creator-identity",
            params: { email, clientId, role, region, city, address },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header (igual patrón que form-creator.tsx) */}
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
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="w-full max-w-md self-center">
                        {/* Icono + títulos (alineado al estilo base) */}
                        <View className="mb-8 items-center">
                            <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-orange-50">
                                <Ionicons name="map-outline" size={64} color="#db5a26" />
                            </View>

                            <Text className="mb-3 text-center text-3xl font-semibold text-gray-900">
                                Ubicación del emprendimiento
                            </Text>

                            <Text className="text-center text-base text-gray-800">
                                Define región, ciudad y dirección para que te encuentren por cercanía
                            </Text>
                        </View>

                        {/* Región */}
                        <Text className="mb-2 text-base font-semibold text-gray-900">Región</Text>
                        <Pressable
                            onPress={() => setOpenRegion(true)}
                            className="mb-6 h-14 flex-row items-center justify-between rounded-3xl bg-gray-100 px-6"
                            accessibilityRole="button"
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
                            accessibilityRole="button"
                        >
                            <Text className={`text-base ${city ? "text-gray-900" : "text-gray-500"}`}>
                                {region ? city || "Selecciona" : "Primero región"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#6B7280" />
                        </Pressable>

                        {/* Dirección */}
                        <Text className="mb-2 text-base font-semibold text-gray-900">Dirección o referencia</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Ej: 2 Sur 1123, Talca"
                            placeholderTextColor="#9CA3AF"
                            className="mb-6 h-14 rounded-3xl border-0 bg-gray-100 px-6 text-base text-gray-900"
                            returnKeyType="done"
                        />

                        {/* Info box (mismo tono) */}
                        <View className="mb-8 flex-row items-start gap-3 rounded-2xl bg-gray-100 p-4">
                            <Ionicons name="information-circle-outline" size={20} color="#db5a26" />
                            <Text className="flex-1 text-base text-gray-700">
                                Esta ubicación se mostrará de forma aproximada para proteger tu privacidad.
                            </Text>
                        </View>

                        {/* CTA */}
                        <Pressable
                            onPress={goNext}
                            disabled={!canContinue}
                            className={`mt-2 h-14 w-full items-center justify-center rounded-3xl ${canContinue ? "bg-orange-600 active:opacity-90" : "bg-orange-300"
                                }`}
                            accessibilityRole="button"
                        >
                            <Text className="text-lg font-medium text-white">Continuar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAL Región */}
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
                            <Pressable
                                onPress={() => setOpenRegion(false)}
                                className="mt-2 h-12 items-center justify-center rounded-2xl bg-gray-100"
                            >
                                <Text className="text-base text-gray-800">Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {/* MODAL Ciudad */}
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
                            <Pressable
                                onPress={() => setOpenCity(false)}
                                className="mt-2 h-12 items-center justify-center rounded-2xl bg-gray-100"
                            >
                                <Text className="text-base text-gray-800">Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
