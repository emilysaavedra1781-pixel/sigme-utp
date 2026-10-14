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
    paddingHorizontal: 23,
    paddingTop: 17,
    paddingBottom: 36,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 42,
    height: 34,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 17,
  },

  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#171717",
    textAlign: "center",
    marginBottom: 23,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 15,
  },

  sectionTitle: {
    color: RED,
    fontSize: 14,
    fontWeight: "500",
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DADDE2",
    marginLeft: 3,
  },

  field: {
    marginBottom: 11,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 5,
  },

  inputContainer: {
    height: 38,
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
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 12,
    color: DARK,
  },

  eyeButton: {
    height: 38,
    width: 39,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    marginTop: 4,
    color: RED,
    fontSize: 11,
  },

  message: {
    marginTop: 13,
    color: RED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  createButton: {
    height: 44,
    marginTop: 28,
    borderRadius: 7,
    backgroundColor: RED,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 20,
  },

  footerText: {
    fontSize: 12,
    color: "#171717",
  },

  loginLink: {
    fontSize: 12,
    color: "#16489C",
    fontWeight: "600",
  },
});