import { StyleSheet } from "react-native";

export const RED = "#B70F35";
export const DARK = "#172238";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 23,
    paddingTop: 17,
    paddingBottom: 36,
  },

  backButton: {
    width: 42,
    height: 34,
    justifyContent: "center",
    marginBottom: 17,
  },

  title: {
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
    color: "#171717",
  },

  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#777777",
    marginTop: 8,
    marginBottom: 25,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 14,
    color: RED,
    fontWeight: "500",
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DADDE2",
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 5,
  },

  inputContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8CDD4",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },

  inputError: {
    borderColor: RED,
  },

  inputIcon: {
    marginLeft: 11,
    marginRight: 11,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: DARK,
    fontSize: 12,
  },

  errorText: {
    color: RED,
    fontSize: 11,
    marginTop: 4,
  },

  hint: {
    color: "#777777",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  message: {
    color: RED,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 20,
  },

  button: {
    height: 44,
    backgroundColor: RED,
    borderRadius: 7,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});