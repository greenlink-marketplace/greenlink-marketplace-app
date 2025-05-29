import { Text, TextInput, View } from 'react-native'
import { Colors } from "../constants/Colors"

/**
 * ...
 *
 * @param {Object} params - ...
 * @param {"default"|"email-address"|"numeric"} params.keyboardType - O padrão é "default".
 */
export function CustomTextInput({
  editable = true,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  fontSize = 18,
  error = false,
  messageError = ""
}) {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: 'column',
        alignItems: 'flex-start',
        rowGap: 10
      }}
    >
      <Text
        style={[
          {
            color: "#000",
            fontSize: fontSize
          },
          error
            ? { color: Colors.sustainableTerracottaRed }
            : null
        ]}
      >
        {placeholder}
      </Text>
      <TextInput
        editable={editable}
        value={value}
        onChangeText={onChangeText}
        style={[
          {
            fontSize: fontSize - 2,
            height: 50,
            borderColor: '#fff0',
            borderWidth: 1,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: Colors.matteNeutralGray,
            width: '100%',
          },
          error
            ? { borderColor: Colors.sustainableTerracottaRed }
            : null
        ]}
        keyboardType={keyboardType}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
      />
      {messageError != ""
        ? <Text
          style={{
            color: Colors.sustainableTerracottaRed,
            fontSize: fontSize - 2
          }}
        >
          {messageError}
        </Text> : null}
    </View>
  )
}