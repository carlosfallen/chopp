import './ShopHeader.css';

export default function ShopHeader() {
  return (
    <div class="shop-header">
      <div class="container">
        <div class="shop-header-content">
          <div class="shop-header-text">
            <h1>Nossa Loja de Chopps</h1>
            <p>Escolha seu estilo preferido, selecione a quantidade e finalize seu pedido</p>
          </div>
          <a href="/#calculadora" class="btn btn-secondary">
            Calcular quantidade ideal
          </a>
        </div>
      </div>
    </div>
  );
}