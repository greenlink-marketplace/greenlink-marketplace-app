import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomTextInput } from '../../components/CustomTextInput';
import { Colors } from '../../constants/Colors';

export default function ReceiveMaterial({ }) {
  return (
    <SafeAreaView
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Colors.matteNeutralGray }
      ]}>
      <ScrollView
        style={[
          StyleSheet.absoluteFill,
          {
            // backgroundColor: Colors.matteNeutralGray,
            // justifyContent: 'center',
            // alignItems: 'center',
            // flexDirection: 'row'
          }
        ]}>
        <View
          style={{
            backgroundColor: Colors.snowWhite,
            margin: 30,
            padding: 20,
            borderRadius: 20,
            gap: 20
          }}>
          <CustomTextInput
            placeholder="código do cupom" />
          {/* <CustomTextInput
            placeholder="Descrição" />
          <CustomTextInput
            placeholder="Quantidade em Kg" />
          <CustomTextInput
            placeholder="Categoria do Produto" />
          <CustomTextInput
            placeholder="Consumidor" /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}