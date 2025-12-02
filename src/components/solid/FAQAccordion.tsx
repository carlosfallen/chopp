// FILE: src/components/solid/FAQAccordion.tsx (corrigido)
import { createSignal, For, type Accessor } from 'solid-js';
import './FAQAccordion.css';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = createSignal<number | null>(null);
  
  const faqs = [
    {
      question: 'A chopeira é realmente gratuita?',
      answer: 'Sim! O empréstimo da chopeira é gratuito para pedidos a partir de 30 litros. Apenas cobramos uma taxa de caução que é devolvida integralmente após o evento.'
    },
    {
      question: 'Com quanto tempo de antecedência devo fazer o pedido?',
      answer: 'Recomendamos pelo menos 5 dias de antecedência para garantir disponibilidade. Para eventos maiores ou datas especiais, sugerimos 2 semanas.'
    },
    {
      question: 'Vocês entregam em quais regiões?',
      answer: 'Atendemos toda a Grande São Paulo e interior. Digite seu CEP na calculadora para verificar se atendemos sua região.'
    },
    {
      question: 'Posso devolver o barril com sobra de chopp?',
      answer: 'Sim! Caso sobre chopp no barril, você pode devolver e fazemos o reembolso proporcional da quantidade não consumida.'
    },
    {
      question: 'Como funciona a instalação da chopeira?',
      answer: 'Nossa equipe leva, instala e regula a chopeira no local do evento. Testamos tudo antes de sair para garantir funcionamento perfeito.'
    },
    {
      question: 'Posso alugar copos e outros acessórios?',
      answer: 'Sim! Oferecemos aluguel de copos, baldes de gelo, mesas e outros itens. Entre em contato para saber valores e disponibilidade.'
    },
    {
      question: 'E se tiver algum problema durante o evento?',
      answer: 'Temos suporte via WhatsApp durante todo o evento. Nossa equipe está pronta para ajudar com qualquer necessidade.'
    },
    {
      question: 'Quais formas de pagamento vocês aceitam?',
      answer: 'Aceitamos PIX, cartão de crédito e débito. O pagamento pode ser feito no ato da entrega ou antecipado via transferência.'
    }
  ];
  
  const toggle = (index: number) => {
    setOpenIndex(openIndex() === index ? null : index);
  };
  
  return (
    <div class="faq-container">
      <For each={faqs}>
        {(faq: typeof faqs[0], i: Accessor<number>) => (
          <div class="faq-item" classList={{ active: openIndex() === i() }}>
            <button class="faq-question" onClick={() => toggle(i())}>
              <span>{faq.question}</span>
              <svg 
                class="faq-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}