import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const kpiCards = [
  { title: 'Toplanan Süt', value: '8.420 L', change: '+12%', tone: '#22c55e' },
  { title: 'Aktif Rota', value: '14', change: '+3', tone: '#60a5fa' },
  { title: 'Bekleyen Kabul', value: '5', change: '-2', tone: '#f59e0b' },
  { title: 'Anlık Verim', value: '%96.4', change: '+1.8%', tone: '#a78bfa' },
];

const pickups = [
  { village: 'Karakaya', liters: 950, status: 'Tamamlandı' },
  { village: 'Yenikent', liters: 780, status: 'Yolda' },
  { village: 'Aşağıova', liters: 610, status: 'Planlandı' },
  { village: 'Demirli', liters: 420, status: 'Planlandı' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Admin Dashboard</Text>
      <Text style={styles.pageSubtitle}>Süt toplama ve kabul operasyonu - günlük özet</Text>

      <View style={styles.kpiGrid}>
        {kpiCards.map((card) => (
          <View key={card.title} style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>{card.title}</Text>
            <Text style={styles.kpiValue}>{card.value}</Text>
            <Text style={[styles.kpiChange, { color: card.tone }]}>{card.change}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı Aksiyonlar</Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>Rota Oluştur</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>Şoför Ata</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>Kabul Aç</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Toplama</Text>
        <View style={styles.chartCard}>
          <View style={[styles.bar, { width: '82%' }]} />
          <View style={[styles.bar, { width: '67%' }]} />
          <View style={[styles.bar, { width: '74%' }]} />
          <View style={[styles.bar, { width: '88%' }]} />
          <Text style={styles.chartHint}>Son 4 rota ortalama doluluk seviyesi</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son Hareketler</Text>
        {pickups.map((item) => (
          <View key={item.village} style={styles.listItem}>
            <View>
              <Text style={styles.listTitle}>{item.village}</Text>
              <Text style={styles.listMeta}>{item.liters} L</Text>
            </View>
            <Text style={styles.listStatus}>{item.status}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 18,
  },
  pageTitle: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '800',
  },
  pageSubtitle: {
    marginTop: 4,
    color: '#cbd5e1',
    fontSize: 14,
  },
  kpiGrid: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#111c33',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  kpiTitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  kpiValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  kpiChange: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    marginTop: 8,
    gap: 10,
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  actionText: {
    color: '#eff6ff',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#111c33',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  bar: {
    height: 11,
    borderRadius: 999,
    backgroundColor: '#38bdf8',
  },
  chartHint: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 12,
  },
  listItem: {
    backgroundColor: '#111c33',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  listMeta: {
    marginTop: 2,
    color: '#94a3b8',
    fontSize: 13,
  },
  listStatus: {
    color: '#93c5fd',
    fontWeight: '600',
  },
});