import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  gridContent: {
    // paddingHorizontal: 16,
    paddingBottom: 80,
  },
  initialLoaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
  },

  // ── info row (song count + view toggle) ──
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  songCount: {
    fontSize: 12,
    opacity: 0.55,
    fontWeight: '500',
  },
  viewToggle: {
    padding: 4,
  },

  // ── Play All / Shuffle / Download row ──
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Download progress bar ──
  downloadAllBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  downloadAllText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  downloadAllCancel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },

  // ── info row right cluster ──
  infoRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  downloadIconBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── grid ──
  gridItem: {
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default styles;
