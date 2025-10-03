import { API_BASE_URL } from "@env";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTPVerificationScreen() {
    const router = useRouter();
    const { email, verificationId } = useLocalSearchParams<{ email?: string; verificationId?: string }>();

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [timer, setTimer] = useState(24);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        if (timer > 0) {
            const id = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(id);
        }
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const digit = value.slice(-1);
        setOtp((prev) => {
            const next = [...prev];
            next[index] = digit;
            return next;
        });
        if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (index: number, e: { nativeEvent: { key: string } }) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        setTimer(24);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
    };

    const handleVerify = async () => {
        setErr(null);
        const code = otp.join("");
        if (!verificationId) {
            setErr("Falta el identificador de verificación (verificationId).");
            return;
        }
        if (code.length !== 6) {
            setErr("Ingresa los 6 dígitos del código.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/public/verification/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verificationId, code }),
            });

            // Puedes leer un body con info adicional si tu backend lo envía:
            // const data = await res.json().catch(() => null);

            if (!res.ok) {
                // const msg = data?.message || "No fue posible verificar el código.";
                const msg = "No fue posible verificar el código.";
                throw new Error(msg);
            }

            // Éxito → ir a pantalla de cuenta verificada (pasando email si quieres mostrarlo)
            router.replace({ pathname: "/account-verified", params: { email } });
        } catch (e: any) {
            setErr(e?.message ?? "Error al verificar el código.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Back */}
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
                            <MaterialCommunityIcons name="email-outline" size={64} color="#db5a26" />
                        </View>

                        {/* Marca */}
                        <Text className="mb-4 text-center text-4xl font-semibold text-orange-700">RecienHecho</Text>

                        {/* Subtítulo */}
                        <Text className="mb-2 text-center text-lg text-gray-800">Verifica tu cuenta</Text>

                        {/* Email destino */}
                        <Text className="mb-8 text-center text-base font-medium text-gray-900">
                            {email || "tu-email@dominio.com"}
                        </Text>

                        {/* Etiqueta */}
                        <Text className="mb-4 text-center text-base text-gray-600">Ingresa el código de 6 dígitos</Text>

                        {/* OTP Inputs */}
                        <View className="mb-4 flex-row justify-center gap-2">
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    value={digit}
                                    onChangeText={(v) => handleChange(index, v)}
                                    onKeyPress={(e) => handleKeyPress(index, e)}
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    selectTextOnFocus
                                    className="h-14 w-12 rounded-2xl bg-gray-100 text-center text-lg font-medium text-gray-900"
                                    accessibilityLabel={`Dígito ${index + 1}`}
                                />
                            ))}
                        </View>

                        {/* Mensaje de error */}
                        {!!err && <Text className="mb-2 text-center text-sm text-red-600">{err}</Text>}

                        {/* Botón verificar */}
                        <Pressable
                            onPress={handleVerify}
                            disabled={loading}
                            className={`mt-2 h-14 w-full items-center justify-center rounded-3xl ${loading ? "bg-orange-300" : "bg-orange-600"
                                } ${loading ? "" : "active:opacity-90"}`}
                            accessibilityRole="button"
                        >
                            {loading ? (
                                <View className="flex-row items-center gap-2">
                                    <ActivityIndicator />
                                    <Text className="text-lg font-medium text-white">Verificando…</Text>
                                </View>
                            ) : (
                                <Text className="text-lg font-medium text-white">Verificar código</Text>
                            )}
                        </Pressable>

                        {/* Reenviar */}
                        <Pressable onPress={handleResend} disabled={timer > 0} className="mt-6" accessibilityRole="button">
                            <Text className={`text-center text-base ${timer > 0 ? "text-gray-500" : "text-gray-800"}`}>
                                Reenviar código en <Text className="text-orange-600">{timer}s</Text>
                            </Text>
                        </Pressable>

                        {/* Caja informativa */}
                        <View className="mt-8 w-full rounded-2xl bg-gray-100 p-6">
                            <View className="mb-3 flex-row items-start gap-3">
                                <MaterialCommunityIcons name="email-outline" size={24} color="#db5a26" />
                                <Text className="flex-1 text-base leading-relaxed text-gray-700">
                                    <Text className="font-medium text-gray-900">Revisa tu bandeja de spam</Text> si no encuentras el email.
                                </Text>
                            </View>
                            <Text className="pl-9 text-base leading-relaxed text-gray-700">
                                El código expira en 10 minutos por seguridad.
                            </Text>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
