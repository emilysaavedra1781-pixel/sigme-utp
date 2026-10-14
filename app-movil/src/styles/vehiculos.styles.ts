import { StyleSheet } from 'react-native';
import { COLORS } from './dashboard.styles';

export { COLORS };

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: { marginRight: 12 },
  headerTextBox: {},
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FCE9E9',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  infoBannerIcon: { marginRight: 10, marginTop: 2 },
  infoBannerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  infoBannerText: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },

  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vehicleCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#FADADD',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  vehicleName: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
  vehiclePlate: { fontSize: 12, color: COLORS.textGray, marginTop: 1 },
  vehicleMetaRow: { flexDirection: 'row', marginTop: 4 },
  vehicleMetaText: { fontSize: 11, color: COLORS.textGray, marginRight: 12 },

  badgePrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 14,
    right: 14,
  },
  badgePrincipalText: { color: '#FFF', fontSize: 10, fontWeight: '700', marginLeft: 4 },

  actionsRow: { flexDirection: 'row', marginTop: 12 },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 9,
    marginRight: 8,
  },
  editButtonText: { color: COLORS.primary, fontSize: 12, fontWeight: '600', marginLeft: 4 },

  selectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 9,
  },
  selectButtonOutline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectButtonFilled: {
    backgroundColor: COLORS.primary,
  },
  selectButtonTextOutline: { color: COLORS.primary, fontSize: 12, fontWeight: '600', marginLeft: 4 },
  selectButtonTextFilled: { color: '#FFF', fontSize: 12, fontWeight: '600', marginLeft: 4 },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 6 },

  footerInfo: {
    flexDirection: 'row',
    backgroundColor: '#EDEBFB',
    borderRadius: 12,
    padding: 12,
  },
  footerInfoText: { flex: 1, fontSize: 11, color: '#4B4B4B', marginLeft: 8, lineHeight: 15 },
});