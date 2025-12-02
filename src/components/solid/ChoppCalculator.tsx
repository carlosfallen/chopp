// FILE: src/components/solid/ChoppCalculator.tsx
import { createSignal } from 'solid-js';
import './ChoppCalculator.css';

export default function ChoppCalculator() {
  const [guests, setGuests] = createSignal<number>(0);
  const [hours, setHours] = createSignal<number>(0);
  const [profile, setProfile] = createSignal<string>('moderado');
  const [result, setResult] = createSignal<string>('');
  
  const calculate = () => {
    const g = guests();
    const h = hours();
    
    if (g <= 0 || h <= 0) {
      setResult('Por favor, preencha todos os campos com valores válidos.');
      return;
    }
    
    const factors = {
      leve: 0.3,
      moderado: 0.5,
      intenso: 0.7
    };
    
    const factor = factors[profile() as keyof typeof factors] || 0.5;
    const liters = Math.ceil(g * h * factor);
    const barrels30 = Math.ceil(liters / 30);
    const barrels50 = Math.ceil(liters / 50);
    
    setResult(
      `Recomendamos aproximadamente ${liters}L de chopp, 
      equivalente a ${barrels30} barril(is) de 30L ou ${barrels50} barril(is) de 50L.`
    );
  };
  
  return (
    <div class="calculator-container">
      <div class="calculator-form">
        <div class="form-group">
          <label for="guests">Número de convidados</label>
          <input
            type="number"
            id="guests"
            min="1"
            placeholder="Ex: 50"
            value={guests()}
            onInput={(e) => setGuests(Number(e.currentTarget.value))}
          />
        </div>
        
        <div class="form-group">
          <label for="hours">Duração do evento (horas)</label>
          <input
            type="number"
            id="hours"
            min="1"
            placeholder="Ex: 4"
            value={hours()}
            onInput={(e) => setHours(Number(e.currentTarget.value))}
          />
        </div>
        
        <div class="form-group">
          <label for="profile">Perfil do público</label>
          <select
            id="profile"
            value={profile()}
            onChange={(e) => setProfile(e.currentTarget.value)}
          >
            <option value="leve">Bebe pouco</option>
            <option value="moderado">Moderado</option>
            <option value="intenso">Bebe bem</option>
          </select>
        </div>
        
        <button class="btn btn-primary btn-block" onClick={calculate}>
          Calcular quantidade
        </button>
      </div>
      
      {result() && (
        <div class="calculator-result">
          <h3>Resultado:</h3>
          <p>{result()}</p>
          <a href="https://wa.me/5511999999999?text=Olá!%20Calculei%20meu%20chopp%20e%20gostaria%20de%20fazer%20um%20pedido" 
             class="btn btn-primary" target="_blank">
            Garantir meu chopp
          </a>
        </div>
      )}
    </div>
  );
}