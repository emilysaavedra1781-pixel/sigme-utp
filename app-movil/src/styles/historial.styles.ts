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
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  filterChipText: { fontSize: 12, color: COLORS.textDark, marginRight: 4 },
  filterIconButton: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FCE9E9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  summaryIconBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  summaryLabel: { fontSize: 11, color: COLORS.textGray, marginBottom: 2 },
  summaryValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  summaryDivider: { width: 1, backgroundColor: '#E8C7C7', marginHorizontal: 16 },

  dateGroupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    marginTop: 4,
  },

  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  entryIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FADADD',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  entryLocation: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
  entrySubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  entrySubText: { fontSize: 11, color: COLORS.textGray, marginRight: 10 },

  entryTimesRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  entryTimeBlock: { alignItems: 'flex-start' },
  entryTimeLabel: { fontSize: 9, color: COLORS.textGray },
  entryTimeValue: { fontSize: 12, fontWeight: '700', color: COLORS.textDark },
  entryArrow: { marginHorizontal: 8 },

  entryDuration: { alignItems: 'flex-end', marginLeft: 'auto' },
  entryDurationLabel: { fontSize: 9, color: COLORS.textGray },
  entryDurationValue: { fontSize: 12, fontWeight: '700', color: COLORS.greenAccent },
});