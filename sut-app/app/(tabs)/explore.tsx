import { StyleSheet, Text, View } from 'react-native';

const modules = [
  'Admin Paneli',
  'Sofor Uygulamasi',
  'Fabrika Sut Kabul Ekrani',
];

export default function OperationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Operasyon Modulleri</Text>
      <Text style={styles.subtitle}>Bir sonraki adimda ekran bazli gelistirme yapilacak.</Text>

      {modules.map((name) => (
        <View key={name} style={styles.moduleCard}>
          <Text style={styles.moduleName}>{name}</Text>
          <Text style={styles.moduleStatus}>Taslak hazir</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 56,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: 8,
  },
  moduleCard: {
    backgroundColor: '#111c33',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  moduleStatus: {
    marginTop: 4,
    color: '#93c5fd',
    fontSize: 13,
  },
});
