// FILE: src/components/admin/ProductsManager.tsx
import { createSignal, For, Show, onMount } from 'solid-js';
import './ProductsManager.css';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  sensorNotes: string;
  idealFor: string;
  pricePerLiter: number;
  availableSizes: number[];
  imageUrl?: string;
  featured: boolean;
  active: boolean;
};

export default function ProductsManager() {
  const [products, setProducts] = createSignal<Product[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [editingProduct, setEditingProduct] = createSignal<Product | null>(null);
  const [showModal, setShowModal] = createSignal(false);

  onMount(async () => {
    await loadProducts();

    // Setup do botão adicionar produto - com retry
    const setupAddButton = () => {
      const addBtn = document.getElementById('add-product-btn');
      if (addBtn) {
        addBtn.onclick = () => openModal();
        console.log('✅ Botão adicionar produto conectado');
        return true;
      }
      console.log('⏳ Aguardando botão adicionar produto...');
      return false;
    };

    // Tentar múltiplas vezes
    if (!setupAddButton()) {
      setTimeout(() => {
        if (!setupAddButton()) {
          setTimeout(setupAddButton, 200);
        }
      }, 100);
    }
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      console.log('Produtos carregados:', data);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product?: Product) => {
    console.log('Abrindo modal', product);
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct({
        id: '',
        name: '',
        category: 'Pilsen',
        description: '',
        sensorNotes: '',
        idealFor: '',
        pricePerLiter: 0,
        availableSizes: [30, 50],
        imageUrl: '',
        featured: false,
        active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const saveProduct = async (product: Product) => {
    try {
      const method = product.id ? 'PUT' : 'POST';
      const url = product.id ? `/api/products/${product.id}` : '/api/products';

      if (!product.id) {
        product.id = `product-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      }

      console.log('Salvando produto:', { method, url, product });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to save product');
      }

      await loadProducts();
      closeModal();
      alert('✅ Produto salvo com sucesso!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`❌ Erro ao salvar produto: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      await loadProducts();
      alert('✅ Produto excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('❌ Erro ao excluir produto');
    }
  };

  const toggleActive = async (product: Product) => {
    await saveProduct({ ...product, active: !product.active });
  };

  const toggleFeatured = async (product: Product) => {
    await saveProduct({ ...product, featured: !product.featured });
  };

  return (
    <div class="products-manager">
      <Show when={loading()}>
        <div class="loading">Carregando produtos...</div>
      </Show>

      <Show when={!loading() && products().length === 0}>
        <div class="empty-state">
          <p>Nenhum produto cadastrado ainda.</p>
          <p>Clique em "Adicionar Produto" para começar!</p>
        </div>
      </Show>

      <Show when={!loading() && products().length > 0}>
        <div class="products-grid">
          <For each={products()}>
            {(product: Product) => (
              <div class="product-card-admin" classList={{ inactive: !product.active }}>
                <div class="product-image-admin">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div class="image-placeholder">🍺</div>
                  )}

                  <div class="product-badges">
                    <Show when={product.featured}>
                      <span class="badge badge-featured">Destaque</span>
                    </Show>
                    <Show when={!product.active}>
                      <span class="badge badge-inactive">Inativo</span>
                    </Show>
                  </div>
                </div>

                <div class="product-info-admin">
                  <div class="product-header-admin">
                    <h3>{product.name}</h3>
                    <span class="product-category">{product.category}</span>
                  </div>

                  <p class="product-description-admin">{product.description}</p>

                  <div class="product-details-admin">
                    <div class="detail-item">
                      <strong>Preço:</strong>
                      <span>R$ {product.pricePerLiter.toFixed(2)}/L</span>
                    </div>
                    <div class="detail-item">
                      <strong>Tamanhos:</strong>
                      <span>{product.availableSizes.join('L, ')}L</span>
                    </div>
                  </div>

                  <div class="product-actions">
                    <button
                      class="btn-icon"
                      onClick={() => openModal(product)}
                      title="Editar"
                    >
                      ✏️
                    </button>

                    <button
                      class="btn-icon"
                      onClick={() => toggleFeatured(product)}
                      title={product.featured ? 'Remover destaque' : 'Destacar'}
                    >
                      {product.featured ? '⭐' : '☆'}
                    </button>

                    <button
                      class="btn-icon"
                      onClick={() => toggleActive(product)}
                      title={product.active ? 'Desativar' : 'Ativar'}
                    >
                      {product.active ? '✓' : '✗'}
                    </button>

                    <button
                      class="btn-icon btn-danger"
                      onClick={() => deleteProduct(product.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={showModal()}>
        <ProductModal
          product={editingProduct()}
          onSave={saveProduct}
          onClose={closeModal}
        />
      </Show>
    </div>
  );
}

function ProductModal(props: {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = createSignal<Product>(
    props.product || {
      id: '',
      name: '',
      category: 'Pilsen',
      description: '',
      sensorNotes: '',
      idealFor: '',
      pricePerLiter: 0,
      availableSizes: [30, 50],
      imageUrl: '',
      featured: false,
      active: true
    }
  );

  const [uploading, setUploading] = createSignal(false);
  const [availableImages, setAvailableImages] = createSignal<Array<{key: string, url: string}>>([]);

  onMount(async () => {
    // Carregar imagens disponíveis
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        const data = await response.json();
        setAvailableImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  });

  const handleImageUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      if (data.url) {
        setFormData({ ...formData(), imageUrl: data.url });
        alert('✅ Imagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSave(formData());
  };

  return (
    <div class="modal-overlay" onClick={props.onClose}>
      <div class="modal-content" onClick={(e: MouseEvent) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>{props.product?.id ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button class="modal-close" onClick={props.onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome do Produto *</label>
              <input
                type="text"
                required
                value={formData().name}
                onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
              />
            </div>

            <div class="form-group">
              <label>Categoria *</label>
              <select
                value={formData().category}
                onChange={(e) => setFormData({ ...formData(), category: e.currentTarget.value })}
              >
                <option value="Pilsen">Pilsen</option>
                <option value="IPA">IPA</option>
                <option value="Weiss">Weiss</option>
                <option value="Lager">Lager</option>
                <option value="Ale">Ale</option>
                <option value="Porter">Porter</option>
                <option value="Belgian">Belgian</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição *</label>
            <textarea
              required
              rows={3}
              value={formData().description}
              onInput={(e) => setFormData({ ...formData(), description: e.currentTarget.value })}
            />
          </div>

          <div class="form-group">
            <label>Notas Sensoriais</label>
            <input
              type="text"
              placeholder="Ex: Dourado brilhante, espuma cremosa"
              value={formData().sensorNotes}
              onInput={(e) => setFormData({ ...formData(), sensorNotes: e.currentTarget.value })}
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ideal para</label>
              <input
                type="text"
                placeholder="Ex: 15-30 convidados"
                value={formData().idealFor}
                onInput={(e) => setFormData({ ...formData(), idealFor: e.currentTarget.value })}
              />
            </div>

            <div class="form-group">
              <label>Preço por Litro (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData().pricePerLiter}
                onInput={(e) => setFormData({ ...formData(), pricePerLiter: parseFloat(e.currentTarget.value) })}
              />
            </div>
          </div>

          <div class="form-group">
            <label>Imagem do Produto</label>

            {/* Upload de nova imagem */}
            <div class="image-upload-section">
              <label class="upload-btn" classList={{ uploading: uploading() }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading()}
                  style="display: none;"
                />
                <span>{uploading() ? '⏳ Enviando...' : '📤 Fazer Upload'}</span>
              </label>

              {/* Ou selecionar imagem existente */}
              <select
                onChange={(e) => setFormData({ ...formData(), imageUrl: e.currentTarget.value })}
                disabled={uploading()}
              >
                <option value="">Ou selecione uma imagem existente</option>
                {availableImages().map(img => (
                  <option value={img.url} selected={formData().imageUrl === img.url}>
                    {img.key}
                  </option>
                ))}
              </select>

              {/* Ou colar URL */}
              <input
                type="url"
                placeholder="Ou cole URL diretamente"
                value={formData().imageUrl || ''}
                onInput={(e) => setFormData({ ...formData(), imageUrl: e.currentTarget.value })}
                disabled={uploading()}
              />
            </div>

            {/* Preview da imagem */}
            <Show when={formData().imageUrl}>
              <div class="image-preview-product">
                <img src={formData().imageUrl} alt="Preview" />
              </div>
            </Show>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={formData().featured}
                onChange={(e) => setFormData({ ...formData(), featured: e.currentTarget.checked })}
              />
              <span>Produto em destaque</span>
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                checked={formData().active}
                onChange={(e) => setFormData({ ...formData(), active: e.currentTarget.checked })}
              />
              <span>Produto ativo</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onClick={props.onClose}>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              💾 Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
