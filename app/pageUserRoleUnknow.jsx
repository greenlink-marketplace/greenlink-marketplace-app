import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import useAuthContext from '../hooks/useAuthContext';

export default function PageNotFound() {
    const { userRole } = useLocalSearchParams()
    const { cleanCredetials } = useAuthContext()
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
                Tipo de Usuário Desconhecido
            </Text>
            <Text
                style={{
                    color: Colors.naturalLightYellow,
                    fontSize: 25
                }}
            >
                {userRole}
            </Text>
            <TouchableOpacity
                onPress={() => {
                    cleanCredetials()
                    router.replace("[visitor&cosumer]/(home)")
                }}
            >
                <Text
                    style={{
                        color: Colors.naturalLightYellow,
                        fontSize: 40
                    }}
                >
                    Remover Credenciais e voltar para a página inicial!
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}