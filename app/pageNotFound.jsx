import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

export default function PageNotFound() {
    const { page } = useLocalSearchParams()

    const router = useRouter()

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.mediumGreenProfessional,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text
                style={{
                    color: Colors.naturalLightYellow,
                    fontSize: 20
                }}
            >
                Não foi possível acessar a página:
            </Text>
            <Text
                style={{
                    color: Colors.naturalLightYellow,
                    fontSize: 25
                }}
            >
                {page}
            </Text>
            <TouchableOpacity
                onPress={() => router.replace("/(home)")}
            >
                <Text
                    style={{
                        color: Colors.naturalLightYellow,
                        fontSize: 40
                    }}
                >
                    Voltar para a página inicial!
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}