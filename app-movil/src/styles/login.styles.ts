import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EFF4FA",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "82%",
    alignSelf: "center",
    paddingTop: 58,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 57,
  },
  utpBox: {
    backgroundColor: "#000000",
    height: 43,
    minWidth: 82,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  utpText: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -2,
  },
  plus: {
    color: "#FF496C",
    fontSize: 39,
    fontWeight: "700",
    marginHorizontal: 3,
    marginTop: -2,
  },
  parkingText: {
    color: "#000000",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -1.3,
  },
  header: {
    marginBottom: 23,
  },
  title: {
    color: "#595959",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#737373",
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: "#C5D6DC",
    marginTop: 13,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#5C5C5C",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 39,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6F6F6F",
    borderRadius: 4,
    paddingHorizontal: 12,
    color: "#333333",
    fontSize: 13,
  },
  helpRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  infoCircle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    marginTop: 1,
  },
  infoText: {
    color: "#252525",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 11,
  },
  helpText: {
    flex: 1,
    color: "#666666",
    fontSize: 12,
    lineHeight: 16,
  },
  passwordContainer: {
    width: "100%",
    height: 39,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6F6F6F",
    borderRadius: 4,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    color: "#333333",
    fontSize: 13,
  },
  eyeButton: {
    height: "100%",
    width: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  eye: {
    color: "#777777",
    fontSize: 17,
  },
  forgotPassword: {
    color: "#26135D",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
  },
  button: {
    height: 37,
    width: "100%",
    backgroundColor: "#D6E1F5",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#B7CBEF",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#686868",
    fontSize: 13,
    fontWeight: "600",
  },
  buttonTextEnabled: {
    color: "#454545",
  },
  registerButton: {
    marginTop: 24,
  },
});