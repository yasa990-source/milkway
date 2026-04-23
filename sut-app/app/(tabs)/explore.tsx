import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Category = {
  id: string;
  title: string;
  description: string;
  isDefault: boolean;
};

type ProductionDraft = {
  sourceAmount: string;
  outputAmount: string;
  personnel: string;
  note: string;
};

const CATEGORY_KEY = 'milkway.production.categories.v1';
const PRODUCTION_KEY = 'milkway.production.records.v1';

const defaultCategories: Category[] = [
  { id: 'cream', title: 'Kaymak Uretimi', description: 'Sut isleme ve kova sayimi', isDefault: true },
  { id: 'cheese', title: 'Kasar Uretimi', description: 'Kasar ve randiman takibi', isDefault: true },
  { id: 'butter', title: 'Tereyagi Uretimi', description: 'Kaymaktan tereyagi uretimi', isDefault: true },
];

export default function OperationsScreen() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [draft, setDraft] = useState<ProductionDraft>({
    sourceAmount: '',
    outputAmount: '',
    personnel: '',
    note: '',
  });

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem(CATEGORY_KEY);
      if (!raw) {
        return;
      }
      try {
        const stored = JSON.parse(raw) as Category[];
        setCategories([...defaultCategories, ...stored.filter((x) => !x.isDefault)]);
      } catch {
        setCategories(defaultCategories);
      }
    };
    void load();
  }, []);

  const saveCustom = async (list: Category[]) => {
    const custom = list.filter((x) => !x.isDefault);
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(custom));
  };

  const addCategory = async () => {
    const title = newName.trim();
    if (!title) {
      return;
    }
    const item: Category = {
      id: `custom-${Date.now()}`,
      title,
      description: newDescription.trim() || 'Ozel imalat kategorisi',
      isDefault: false,
    };
    const updated = [...categories, item];
    setCategories(updated);
    await saveCustom(updated);
    setNewName('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const removeCategory = async (id: string) => {
    const updated = categories.filter((x) => x.id !== id);
    setCategories(updated);
    await saveCustom(updated);
    if (selectedCategory?.id === id) {
      setSelectedCategory(null);
    }
  };

  const moveCustom = async (id: string, direction: 'up' | 'down') => {
    const fixed = categories.filter((x) => x.isDefault);
    const custom = categories.filter((x) => !x.isDefault);
    const idx = custom.findIndex((x) => x.id === id);
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || target < 0 || target >= custom.length) {
      return;
    }
    const reordered = [...custom];
    const temp = reordered[idx];
    reordered[idx] = reordered[target];
    reordered[target] = temp;
    const merged = [...fixed, ...reordered];
    setCategories(merged);
    await saveCustom(merged);
  };

  const beginEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.title);
    setEditDescription(category.description);
  };

  const saveEdit = async (id: string) => {
    const title = editName.trim();
    if (!title) {
      return;
    }
    const updated = categories.map((x) =>
      x.id === id ? { ...x, title, description: editDescription.trim() || 'Ozel imalat kategorisi' } : x,
    );
    setCategories(updated);
    await saveCustom(updated);
    if (selectedCategory?.id === id) {
      const next = updated.find((x) => x.id === id) ?? null;
      setSelectedCategory(next);
    }
    setEditingId(null);
  };

  const saveProduction = async () => {
    if (!selectedCategory || !draft.sourceAmount || !draft.outputAmount) {
      return;
    }
    const existing = await AsyncStorage.getItem(PRODUCTION_KEY);
    const rows = existing ? (JSON.parse(existing) as Record<string, string>[]) : [];
    rows.push({
      categoryId: selectedCategory.id,
      categoryTitle: selectedCategory.title,
      sourceAmount: draft.sourceAmount,
      outputAmount: draft.outputAmount,
      personnel: draft.personnel || 'Fabrika Personeli',
      note: draft.note,
      createdAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(PRODUCTION_KEY, JSON.stringify(rows));
    setDraft({ sourceAmount: '', outputAmount: '', personnel: '', note: '' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Imalat Yonetimi</Text>
      <Text style={styles.subtitle}>Durum kartlari kapali. Kategori tabanli uretim girisi aktif.</Text>

      <View style={styles.panel}>
        <View style={styles.rowBetween}>
          <Text style={styles.panelTitle}>Urun Kategorileri</Text>
          <Pressable style={styles.smallButton} onPress={() => setShowAddForm((p) => !p)}>
            <Text style={styles.smallButtonText}>+ Yeni</Text>
          </Pressable>
        </View>

        {showAddForm ? (
          <View style={styles.formBox}>
            <TextInput
              style={styles.input}
              placeholder="Kategori adi"
              placeholderTextColor="#94a3b8"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Aciklama"
              placeholderTextColor="#94a3b8"
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <Pressable style={styles.primaryButton} onPress={() => void addCategory()}>
              <Text style={styles.primaryButtonText}>Kategoriyi Ekle</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {categories.map((category) => (
        <View key={category.id} style={styles.categoryCard}>
          <Pressable onPress={() => setSelectedCategory(category)}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDesc}>{category.description}</Text>
          </Pressable>

          {!category.isDefault ? (
            <View style={styles.actions}>
              <Pressable style={styles.tinyButton} onPress={() => void moveCustom(category.id, 'up')}>
                <Text style={styles.tinyButtonText}>↑</Text>
              </Pressable>
              <Pressable style={styles.tinyButton} onPress={() => void moveCustom(category.id, 'down')}>
                <Text style={styles.tinyButtonText}>↓</Text>
              </Pressable>
              <Pressable style={styles.tinyButton} onPress={() => beginEdit(category)}>
                <Text style={styles.tinyButtonText}>Duzenle</Text>
              </Pressable>
              <Pressable style={[styles.tinyButton, styles.deleteButton]} onPress={() => void removeCategory(category.id)}>
                <Text style={styles.tinyButtonText}>Sil</Text>
              </Pressable>
            </View>
          ) : null}

          {editingId === category.id ? (
            <View style={styles.formBox}>
              <TextInput style={styles.input} value={editName} onChangeText={setEditName} />
              <TextInput style={styles.input} value={editDescription} onChangeText={setEditDescription} />
              <Pressable style={styles.primaryButton} onPress={() => void saveEdit(category.id)}>
                <Text style={styles.primaryButtonText}>Degisikligi Kaydet</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ))}

      {selectedCategory ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{selectedCategory.title} - Imalat Girisi</Text>
          <TextInput
            style={styles.input}
            placeholder="Kaynak miktar"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={draft.sourceAmount}
            onChangeText={(v) => setDraft((d) => ({ ...d, sourceAmount: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Cikis miktar"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={draft.outputAmount}
            onChangeText={(v) => setDraft((d) => ({ ...d, outputAmount: v }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Personel"
            placeholderTextColor="#94a3b8"
            value={draft.personnel}
            onChangeText={(v) => setDraft((d) => ({ ...d, personnel: v }))}
          />
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Not"
            placeholderTextColor="#94a3b8"
            multiline
            value={draft.note}
            onChangeText={(v) => setDraft((d) => ({ ...d, note: v }))}
          />
          <Pressable style={styles.primaryButton} onPress={() => void saveProduction()}>
            <Text style={styles.primaryButtonText}>Imalat Kaydet</Text>
          </Pressable>
        </View>
      ) : null}
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
    gap: 12,
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
  panel: {
    backgroundColor: '#111c33',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  categoryCard: {
    backgroundColor: '#111c33',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  categoryDesc: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  formBox: {
    gap: 8,
  },
  input: {
    backgroundColor: '#0b1224',
    color: '#f8fafc',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#eff6ff',
    fontWeight: '700',
  },
  smallButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallButtonText: {
    color: '#eff6ff',
    fontWeight: '700',
    fontSize: 12,
  },
  tinyButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#0b1224',
  },
  deleteButton: {
    borderColor: '#7f1d1d',
  },
  tinyButtonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
});
