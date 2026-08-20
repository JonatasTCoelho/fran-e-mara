import React, { useEffect, useState } from 'react';

function App() {
  // Estado para controlar a exibição do conteúdo (Delay do VSL)
  const [showContent, setShowContent] = useState(false);
  
  // Estado para o Cronômetro de Urgência (15 minutos)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // Estado para o botão de voltar ao topo
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Estado para o menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Delay de 5 segundos para testes. 
    // Para 12 minutos, altere 5000 para: 12 * 60 * 1000 (ou seja, 720000)
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);

    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const isMobile = window.innerWidth < 768;
        if (!isMobile && (targetId === '#oferta' || targetId === '#resultados')) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const heading = targetElement.querySelector('h2') || targetElement;
          const headingTop = heading.getBoundingClientRect().top + window.pageYOffset;
          const offset = isMobile ? 65 : 90;
          window.scrollTo({
            top: Math.max(0, headingTop - offset),
            behavior: 'smooth'
          });
        }
      }
    };
    anchors.forEach(anchor => anchor.addEventListener('click', handleClick));
    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleClick));
      clearTimeout(timer);
    };
  }, []);

  // Efeito para Scroll Reveal (Animações de entrada)
  useEffect(() => {
    if (!showContent) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px', // Dispara um pouco antes de entrar totalmente
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [showContent]);

  return (
    <>
      {/* 1. Top Alert Block */}
      <div className="alert-bar w-full py-3 px-gutter text-center z-[60] relative shadow-[0_4px_20px_rgba(255,0,255,0.2)]">
        <p className="font-label-caps text-[12px] md:text-label-caps text-white font-bold flex flex-wrap items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>ÚLTIMA CHANCE: As inscrições com desconto encerram em:</span>
          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/20 font-mono text-[16px] text-vc-gold tracking-widest tabular-nums drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
            {formatTime(timeLeft)}
          </span>
        </p>
      </div>

      {/* TopAppBar */}
      <header className="absolute top-0 w-full z-50 glass-nav border-b border-white/5 mt-[44px]">
        <div className="flex justify-between items-center px-gutter py-5 max-w-container-max-width mx-auto">
          <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="flex items-center group cursor-pointer">
            <img 
              src="/logo.png" 
              alt="Vendas Conectadas com Mara Camargo e Fran Martins" 
              className="h-9 sm:h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>
          <nav className="hidden md:flex gap-10 items-center">
            <a className="text-white/70 hover:text-vc-gold transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 tracking-wider" href="#metodo">O Método</a>
            <a className="text-white/70 hover:text-vc-gold transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 tracking-wider" href="#resultados">Resultados</a>
            <a className="text-white/70 hover:text-vc-gold transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 tracking-wider" href="#oferta">Oferta</a>
            <a className="text-white/70 hover:text-vc-gold transition-colors font-label-caps text-label-caps cursor-pointer active:scale-95 tracking-wider" href="#faq">FAQ</a>
          </nav>
          <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="hidden md:block bg-vc-magenta text-white font-label-caps text-label-caps py-3 px-8 rounded-sm hover:bg-vc-magenta-hover transition-all duration-300 glow-magenta font-bold cursor-pointer active:scale-95 uppercase tracking-wider text-center">
            Matricular Agora
          </a>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Menu" 
            className="md:hidden text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-300">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            aria-label="Fechar Menu"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <nav className="flex flex-col items-center gap-8 text-2xl font-bold">
            <a onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-vc-gold transition-colors" href="#metodo">O Método</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-vc-gold transition-colors" href="#resultados">Resultados</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-vc-gold transition-colors" href="#oferta">Oferta</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-vc-gold transition-colors" href="#faq">FAQ</a>
          </nav>
          <a 
            href="https://pay.kiwify.com.br/p3v2VJS" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-vc-magenta text-white font-label-caps text-label-caps py-4 px-10 rounded-sm hover:bg-vc-magenta-hover transition-all duration-300 glow-magenta font-bold uppercase tracking-wider text-center"
          >
            Matricular Agora
          </a>
        </div>
      )}

      <div className="w-full overflow-x-hidden">
        <main className="flex-grow pt-20">
          {/* 2. Hero Section */}
          <section className="py-10 md:py-16 px-gutter max-w-container-max-width mx-auto flex flex-col items-center text-center relative mt-4">
            {/* Decorative Grid & Glow */}
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-50 z-0"></div>
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vc-magenta/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-vc-gold/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
            <div className="relative z-10 inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-vc-magenta/40 bg-vc-magenta/5 backdrop-blur-sm mb-10 shadow-[0_0_15px_rgba(255,0,255,0.1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-vc-magenta animate-pulse shadow-[0_0_10px_#FF00FF]"></span>
              <span className="font-label-caps text-label-caps text-vc-magenta tracking-widest font-bold">MÉTODO VALIDADO</span>
            </div>
            <h1 className="relative z-10 font-display-lg text-[24px] sm:text-[32px] md:text-display-lg text-white mb-4 sm:mb-6 max-w-[1000px] leading-[1.25] md:leading-[1.1]">
              Conquiste novos clientes todos os dias com uma estratégia digital{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vc-gold via-[#FFF8D6] to-vc-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">simples e lucrativa</span>.
            </h1>
            <p className="relative z-10 font-body-lg text-sm sm:text-base md:text-body-lg text-white/70 mb-8 max-w-3xl leading-relaxed">
              <span className="md:hidden">Domine o método para atrair os clientes certos e vender todos os dias no digital.</span>
              <span className="hidden md:inline">Você não precisa viver criando conteúdo para vender no digital.<br className="hidden md:block"/>Basta dominar o método para atrair as pessoas certas e fechar vendas todos os dias.</span>
            </p>
            

            {/* VSL Video */}
            <div className="relative z-10 w-full max-w-3xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.1)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_60px_rgba(255,0,255,0.15)] border border-white/10 hover:border-vc-magenta/30">
              <iframe 
                className="w-full aspect-video object-cover bg-black"
                src="https://www.youtube.com/embed/8eIuBaCK-aA?autoplay=1&mute=1&playsinline=1"
                title="Aprenda o Caminho Secreto para o seu Negócio Brilhar no Digital!"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            {showContent && (
              <div className="animate-fade-in-up w-full flex flex-col items-center">
                <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-block text-center w-full md:w-auto bg-vc-magenta text-white font-headline-md py-6 px-14 rounded-lg transition-all duration-300 glow-magenta-hover font-bold shadow-[0_10px_30px_rgba(255,0,255,0.3)] hover:-translate-y-1 uppercase tracking-wide">
                  QUERO ACESSAR O MÉTODO
                </a>
                <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-60">
                  <span className="flex items-center gap-1.5 sm:gap-2 font-label-caps text-[11px] sm:text-[13px] tracking-wider"><span className="material-symbols-outlined text-[16px] sm:text-[18px]">lock</span> PAGAMENTO SEGURO</span>
                  <span className="flex items-center gap-1.5 sm:gap-2 font-label-caps text-[11px] sm:text-[13px] tracking-wider"><span className="material-symbols-outlined text-[16px] sm:text-[18px]">update</span> ACESSO IMEDIATO</span>
                </div>
              </div>
            )}
          </section>

          {showContent && (
            <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.2s' }}>

              {/* 2. IDENTIFICAÇÃO */}
              <section className="py-8 md:py-24 bg-gradient-to-b from-black via-[#050505] to-black relative border-y border-white/5">
                <div className="px-gutter max-w-container-max-width mx-auto relative z-10">
                  <div className="text-center mb-8 md:mb-12 reveal">
                    <h2 className="font-display-lg-mobile md:font-display-lg text-[22px] sm:text-[28px] md:text-[40px] text-white mb-4 md:mb-6">
                      <span className="md:hidden">Você se identifica com essas situações?</span>
                      <span className="hidden md:inline">Você se identifica com alguma dessas situações?</span>
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3.5 md:gap-y-8 gap-x-10 mb-8 md:mb-12 reveal reveal-delay-1 max-w-5xl mx-auto">
                    <div className="flex gap-3 sm:gap-4 items-start text-left bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                      <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl shrink-0 mt-0.5">error</span>
                      <p className="text-white/80 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Sabe que poderia vender muito mais no digital.</span>
                        <span className="hidden md:inline">Você sabe que poderia vender muito mais utilizando o digital.</span>
                      </p>
                    </div>
                    <div className="flex gap-3 sm:gap-4 items-start text-left bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                      <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl shrink-0 mt-0.5">error</span>
                      <p className="text-white/80 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Receio de investir em anúncios e perder dinheiro.</span>
                        <span className="hidden md:inline">Tem receio de investir em anúncios e perder dinheiro.</span>
                      </p>
                    </div>
                    <div className="flex gap-3 sm:gap-4 items-start text-left bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                      <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl shrink-0 mt-0.5">error</span>
                      <p className="text-white/80 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Sem saber exatamente por onde começar.</span>
                        <span className="hidden md:inline">Não sabe exatamente por onde começar.</span>
                      </p>
                    </div>
                    <div className="flex gap-3 sm:gap-4 items-start text-left bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                      <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl shrink-0 mt-0.5">error</span>
                      <p className="text-white/80 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Atrai curiosos, mas poucos realmente compram.</span>
                        <span className="hidden md:inline">Atrai pessoas interessadas, mas poucas realmente compram.</span>
                      </p>
                    </div>
                    <div className="flex gap-3 sm:gap-4 items-start text-left bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                      <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl shrink-0 mt-0.5">error</span>
                      <p className="text-white/80 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Dificuldade de fechar vendas no WhatsApp/Direct.</span>
                        <span className="hidden md:inline">Recebe mensagens e sente dificuldade em conduzir a conversa até a venda.</span>
                      </p>
                    </div>
                    <div className="flex gap-3 sm:gap-4 items-start text-left bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                      <span className="material-symbols-outlined text-red-500 text-xl sm:text-2xl shrink-0 mt-0.5">error</span>
                      <p className="text-white/80 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Vê concorrentes crescendo e fica para trás.</span>
                        <span className="hidden md:inline">Vê concorrentes crescendo enquanto acredita que seu negócio poderia estar muito mais à frente.</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-center bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-8 max-w-3xl mx-auto shadow-2xl relative reveal reveal-delay-2">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                    <p className="font-headline-lg text-[17px] sm:text-[22px] md:text-[26px] leading-snug text-white/90">
                      O problema não é falta de esforço.<br/>
                      <span className="text-red-500 font-bold mt-1 sm:mt-2 inline-block">É falta de estratégia.</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. O INIMIGO e 4. O HERÓI */}
              <section className="py-8 md:pt-8 md:pb-24 bg-black relative border-b border-white/5">
                <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute top-2/3 right-0 w-[400px] h-[400px] bg-vc-gold/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
                
                <div className="px-gutter max-w-container-max-width mx-auto relative z-10 flex flex-col gap-6 md:gap-10">
                  
                  {/* O Inimigo */}
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                    <div className="flex-1 text-left reveal">
                      <span className="font-label-caps text-xs sm:text-label-caps text-red-500 mb-1 sm:mb-2 block tracking-widest uppercase font-bold">O Inimigo</span>
                      <h2 className="font-headline-lg text-[22px] sm:text-[28px] md:text-[36px] text-white mb-2 sm:mb-4 leading-[1.2]">
                        <span className="md:hidden">Chega de perder vendas no digital.</span>
                        <span className="hidden md:inline">Chega de perder vendas por falta de estratégia no digital.</span>
                      </h2>
                      <p className="font-body-lg text-xs sm:text-base md:text-body-lg text-white/70 leading-relaxed mb-3 sm:mb-4">
                        <span className="md:hidden">Sem um método claro, você ganha curtidas, mas não coloca dinheiro no bolso.</span>
                        <span className="hidden md:inline">Enquanto você foge do Instagram, a concorrência cresce. Sem um método claro, você até ganha curtidas, mas não coloca dinheiro no bolso.</span>
                      </p>
                    </div>
                    
                    <div className="flex-1 w-full flex justify-center">
                       <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-3xl p-4 sm:p-8 relative shadow-2xl">
                          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 mb-3 sm:mb-6">
                            <span className="material-symbols-outlined text-white/50 text-2xl sm:text-4xl">visibility_off</span>
                          </div>
                          <p className="font-headline-md text-sm sm:text-xl leading-snug text-white/90 italic">
                            &quot;Sem um método, você é apenas mais um no barulho digital.&quot;
                          </p>
                       </div>
                    </div>
                  </div>

                  {/* O Herói */}
                  <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12">
                    <div className="flex-1 text-left reveal">
                      <span className="font-label-caps text-xs sm:text-label-caps text-vc-gold mb-1 sm:mb-2 block tracking-widest uppercase font-bold">A Solução</span>
                      <h2 className="font-headline-lg text-[22px] sm:text-[28px] md:text-[36px] text-white mb-2 sm:mb-4 leading-[1.2]">
                        Conheça o Método Vendas Conectadas.
                      </h2>
                      <p className="font-body-lg text-xs sm:text-base md:text-body-lg text-white/70 leading-relaxed mb-3 sm:mb-4">
                        <span className="md:hidden">Marketing e vendas alinhados em um passo a passo para multiplicar seu faturamento.</span>
                        <span className="hidden md:inline">Unimos marketing digital e técnicas comerciais em um passo a passo prático para você dominar a atração de clientes e multiplicar seu faturamento.</span>
                      </p>
                    </div>
                    
                    <div className="flex-1 w-full flex justify-center">
                       <div className="w-full max-w-md bg-vc-magenta/5 border border-vc-magenta/20 rounded-xl sm:rounded-3xl p-4 sm:p-8 relative shadow-[0_20px_50px_rgba(255,0,255,0.1)]">
                          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-vc-magenta/20 border border-vc-magenta/30 mb-3 sm:mb-6">
                            <span className="material-symbols-outlined text-vc-magenta text-2xl sm:text-4xl">rocket_launch</span>
                          </div>
                          <p className="font-headline-md text-sm sm:text-xl leading-snug text-white/90 italic font-bold">
                            Do primeiro clique até a venda no WhatsApp.
                          </p>
                       </div>
                    </div>
                  </div>

                  {/* CTA 1: Depois do Herói/Solução */}
                  <div className="flex justify-center mt-4 sm:mt-6 reveal reveal-delay-2">
                    <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-block text-center w-full md:w-auto bg-vc-magenta text-white font-headline-md py-3.5 px-8 rounded-lg transition-all duration-300 glow-magenta-hover font-bold shadow-[0_10px_30px_rgba(255,0,255,0.3)] hover:-translate-y-0.5 uppercase tracking-wide text-sm md:text-lg">
                      QUERO ATRAIR MAIS CLIENTES
                    </a>
                  </div>

                </div>
              </section>

              {/* 5. COMO O MÉTODO FUNCIONA */}
              <section className="py-10 md:py-24 md:min-h-screen flex flex-col justify-center px-gutter bg-gradient-to-b from-black via-[#050505] to-black relative border-b border-white/5">
                <div className="max-w-container-max-width mx-auto relative z-10 w-full">
                  <div className="text-center mb-8 md:mb-16 reveal">
                    <h2 className="font-display-lg-mobile md:font-display-lg text-[22px] sm:text-[28px] md:text-[36px] text-white mb-2">
                      <span className="md:hidden">Processo simples e focado em vendas.</span>
                      <span className="hidden md:inline">Um processo simples. Aplicável.<br />E pensado para gerar resultados.</span>
                    </h2>
                  </div>
                  
                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 relative reveal reveal-delay-1">
                    <div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-vc-magenta via-vc-gold to-vc-magenta opacity-30 md:hidden"></div>
                    
                    {[
                      { step: '1', title: 'Posicione sua empresa.' },
                      { step: '2', title: 'Descubra quem realmente compra de você.' },
                      { step: '3', title: 'Anúncios direcionados às pessoas certas.' },
                      { step: '4', title: 'Gere novas oportunidades.' },
                      { step: '5', title: 'Conduza conversas estratégicas.' },
                      { step: '6', title: 'Transforme contatos em clientes.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-row items-center gap-3.5 bg-[#0a0a0a] border border-white/10 p-3.5 md:p-6 rounded-xl md:rounded-2xl relative z-10 hover:border-vc-gold/30 transition-colors">
                        <div className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-vc-magenta/20 border border-vc-magenta/40 flex items-center justify-center shrink-0">
                          <span className="font-bold text-vc-magenta text-sm md:text-xl">{item.step}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-headline-md text-xs sm:text-base md:text-xl leading-tight">{item.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. The Method (Benefits/Features) */}
              <section className="py-10 md:py-20 px-gutter relative" id="metodo">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black pointer-events-none z-0"></div>
                <div className="max-w-container-max-width mx-auto relative z-10">
                  <div className="text-center mb-8 md:mb-10 reveal">
                    <h2 className="font-display-lg-mobile md:font-display-lg text-[22px] sm:text-[28px] md:text-[40px] text-white mb-2 sm:mb-4">O QUE VOCÊ VAI APRENDER</h2>
                    <p className="font-body-lg text-white/70 max-w-2xl mx-auto text-xs sm:text-[15px] md:text-base">
                      Os pilares do Método Vendas Conectadas
                    </p>
                  </div>
      
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-6 reveal reveal-delay-1">
                    {/* Feature 1 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-vc-magenta/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-vc-magenta text-lg sm:text-xl">verified</span>
                      </div>
                      <h3 className="font-headline-md text-sm sm:text-[17px] text-white mb-1 sm:mb-2">Posicionamento Estratégico</h3>
                      <p className="text-white/70 text-xs sm:text-[14px] leading-relaxed">Construa uma presença digital que desperte confiança.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-vc-magenta/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-vc-magenta text-lg sm:text-xl">person_search</span>
                      </div>
                      <h3 className="font-headline-md text-sm sm:text-[17px] text-white mb-1 sm:mb-2">Público Ideal</h3>
                      <p className="text-white/70 text-xs sm:text-[14px] leading-relaxed">Descubra exatamente quem compra de você.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-vc-magenta/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-vc-magenta text-lg sm:text-xl">campaign</span>
                      </div>
                      <h3 className="font-headline-md text-sm sm:text-[17px] text-white mb-1 sm:mb-2">Anúncios Inteligentes</h3>
                      <p className="text-white/70 text-xs sm:text-[14px] leading-relaxed">Impulsione conteúdos para os clientes certos.</p>
                    </div>
                    {/* Feature 4 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-vc-magenta/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-vc-magenta text-lg sm:text-xl">bar_chart</span>
                      </div>
                      <h3 className="font-headline-md text-sm sm:text-[17px] text-white mb-1 sm:mb-2">Leitura de Métricas</h3>
                      <p className="text-white/70 text-xs sm:text-[14px] leading-relaxed">Interprete números para tomar melhores decisões.</p>
                    </div>
                    {/* Feature 5 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-vc-magenta/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-vc-magenta text-lg sm:text-xl">forum</span>
                      </div>
                      <h3 className="font-headline-md text-sm sm:text-[17px] text-white mb-1 sm:mb-2">Prospecção Estratégica</h3>
                      <p className="text-white/70 text-xs sm:text-[14px] leading-relaxed">Encontre clientes no WhatsApp de forma natural.</p>
                    </div>
                    {/* Feature 6 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-vc-magenta/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-vc-magenta text-lg sm:text-xl">handshake</span>
                      </div>
                      <h3 className="font-headline-md text-sm sm:text-[17px] text-white mb-1 sm:mb-2">Comunicação Persuasiva</h3>
                      <p className="text-white/70 text-xs sm:text-[14px] leading-relaxed">Transforme conversas em vendas de forma prática.</p>
                    </div>
                  </div>

                  {/* CTA 2: Depois dos Pilares/O que vai aprender */}
                  <div className="flex justify-center mt-6 sm:mt-10 reveal reveal-delay-2">
                    <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-block text-center w-full md:w-auto bg-vc-magenta text-white font-headline-md py-3.5 sm:py-4 px-8 sm:px-10 rounded-lg transition-all duration-300 glow-magenta-hover font-bold shadow-[0_10px_30px_rgba(255,0,255,0.3)] hover:-translate-y-0.5 uppercase tracking-wide text-sm md:text-lg">
                      QUERO DOMINAR O MÉTODO
                    </a>
                  </div>

                </div>
              </section>
              {/* 7. POR QUE ESSE MÉTODO FUNCIONA */}
              <section className="py-10 md:py-24 bg-gradient-to-b from-black via-[#0a0a0a] to-black relative border-b border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vc-gold/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
                <div className="px-gutter max-w-container-max-width mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-20">
                  <div className="flex-1 text-left reveal">
                    <h2 className="font-headline-lg text-[22px] sm:text-[28px] md:text-headline-lg text-white mb-4 sm:mb-6 leading-[1.2]">
                      <span className="md:hidden">Criado para ser aplicado na prática.</span>
                      <span className="hidden md:inline">Um curso criado para ser aplicado. Não para ficar esquecido.</span>
                    </h2>
                    <div className="font-body-lg text-xs sm:text-base md:text-body-lg text-white/70 leading-relaxed mb-4 sm:mb-6">
                      <p className="md:hidden mb-2">Sem teoria chata. Cada aula termina com uma ação prática para aplicar direto no seu negócio.</p>
                      <div className="hidden md:block space-y-4">
                        <p>Nada de horas de teoria.</p>
                        <p>Nada de conteúdos feitos apenas para aumentar carga horária.</p>
                        <p>Cada aula termina com uma ação prática para ser aplicada imediatamente no seu negócio.</p>
                      </div>
                      <p className="text-vc-gold font-bold text-base sm:text-lg md:text-xl mt-2 sm:mt-4">Você aprende. Aplica. Evolui.</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-2 gap-x-3 gap-y-2.5 sm:gap-y-4 reveal reveal-delay-1">
                    {[
                      'Aplicação imediata', 'Método validado', 'Linguagem simples', 
                      'Estratégias atuais', 'Sem enrolação', 'Foco em resultados'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 py-0.5 text-left">
                        <span className="material-symbols-outlined text-vc-gold text-lg sm:text-2xl shrink-0">check_circle</span>
                        <span className="text-white/80 font-headline-md text-xs sm:text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 8. VOCÊ NÃO PRECISA */}
              <section className="py-10 md:py-24 bg-black relative border-b border-white/5">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
                <div className="px-gutter max-w-container-max-width mx-auto relative z-10">
                  <div className="text-center mb-8 md:mb-16 reveal">
                    <h2 className="font-headline-lg text-[22px] sm:text-[28px] md:text-headline-lg text-white mb-2 sm:mb-4">
                      <span className="md:hidden">Criado para empreendedoras reais.</span>
                      <span className="hidden md:inline">O Vendas Conectadas foi criado para empreendedoras reais.</span>
                    </h2>
                    <p className="font-body-lg text-white/70 text-sm sm:text-base md:text-lg">Você <span className="text-red-500 font-bold">NÃO precisa:</span></p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 md:mb-12 max-w-4xl mx-auto reveal reveal-delay-1">
                    {[
                      'Ser influenciadora.', 'Ter milhares de seguidores.', 'Entender de marketing.',
                      'Fazer vídeos todos os dias.', 'Investir muito dinheiro.'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 bg-[#0a0a0a] border border-white/10 py-2 sm:py-3 px-3 sm:px-6 rounded-full hover:border-red-500/30 transition-colors">
                        <span className="material-symbols-outlined text-red-500 text-base sm:text-xl shrink-0">close</span>
                        <span className="text-white/80 font-body-md text-xs sm:text-base">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center reveal reveal-delay-2">
                    <p className="font-headline-md text-lg sm:text-2xl text-vc-gold inline-block border-b-2 border-vc-gold/30 pb-1.5 sm:pb-2">
                      Você só precisa seguir um método.
                    </p>
                  </div>
                </div>
              </section>

              {/* 9. QUEM SOMOS */}
              <section className="pt-10 md:pt-24 pb-16 md:pb-40 bg-gradient-to-b from-black via-[#050505] to-black relative border-b border-white/5">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-vc-magenta/5 blur-[150px] rounded-t-full pointer-events-none z-0"></div>
                <div className="px-gutter max-w-5xl mx-auto relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12 reveal">
                    
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl p-5 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-vc-magenta/30 transition-colors">
                      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-vc-magenta to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 border-2 border-vc-magenta mb-3 sm:mb-6 flex items-center justify-center overflow-hidden">
                        <img src="/fran.jpg" alt="Fran Martins" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-white font-headline-lg text-lg sm:text-2xl mb-1 sm:mb-2">Fran Martins</h3>
                      <p className="text-vc-magenta font-label-caps text-[11px] sm:text-sm tracking-widest uppercase mb-2 sm:mb-4 font-bold">Especialista em Posicionamento</p>
                      <p className="text-white/70 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Aprenda a fazer os clientes certos encontrarem seu negócio.</span>
                        <span className="hidden md:inline">Ensina como fazer as pessoas certas encontrarem seu negócio.</span>
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl p-5 md:p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-vc-gold/30 transition-colors">
                      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-vc-gold to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/10 border-2 border-vc-gold mb-3 sm:mb-6 flex items-center justify-center overflow-hidden">
                        <img src="/mara.png" alt="Mara Camargo" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-white font-headline-lg text-lg sm:text-2xl mb-1 sm:mb-2">Mara Camargo</h3>
                      <p className="text-vc-gold font-label-caps text-[11px] sm:text-sm tracking-widest uppercase mb-2 sm:mb-4 font-bold">Especialista em Vendas</p>
                      <p className="text-white/70 font-body-md text-xs sm:text-base leading-relaxed">
                        <span className="md:hidden">Transforme o interesse das pessoas em vendas reais.</span>
                        <span className="hidden md:inline">Ensina como transformar interesse em faturamento.</span>
                      </p>
                    </div>

                  </div>
                  
                  <div className="text-center bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 backdrop-blur-sm reveal reveal-delay-1">
                    <p className="font-headline-md text-sm sm:text-xl md:text-2xl text-white/90 italic">
                      &quot;Juntas criamos um método que conecta marketing e vendas de forma prática.&quot;
                    </p>
                  </div>

                  {/* CTA 3: Depois da seção de Quem Somos */}
                  <div className="flex justify-center mt-8 reveal reveal-delay-2">
                    <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-block text-center w-full md:w-auto bg-vc-magenta text-white font-headline-md py-4 px-10 rounded-lg transition-all duration-300 glow-magenta-hover font-bold shadow-[0_10px_30px_rgba(255,0,255,0.3)] hover:-translate-y-0.5 uppercase tracking-wide text-base md:text-lg">
                      QUERO APRENDER COM ELAS
                    </a>
                  </div>

                </div>
              </section>

              {/* 10. PROVAS */}
              <section className="py-8 md:py-20 px-gutter max-w-container-max-width mx-auto relative" id="resultados">
                <div className="text-center mb-6 sm:mb-10 reveal">
                  <h2 className="font-display-lg-mobile md:font-display-lg text-[22px] sm:text-[28px] md:text-[38px] text-white mb-2 sm:mb-4">
                    <span className="md:hidden">Depoimentos Alunos</span>
                    <span className="hidden md:inline">O Método já transformou negócios reais. Agora chegou sua vez.</span>
                  </h2>
                </div>
                
                {/* Grid de Provas (Misto de Vídeos, Prints e Depoimentos) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 reveal reveal-delay-1">
                  
                  {/* Depoimento Texto 1 */}
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center text-center shadow-lg hover:border-vc-gold/30 transition-colors">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full mb-3 overflow-hidden border-2 border-vc-gold flex items-center justify-center shrink-0">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" alt="Ana Clara" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Ana Clara</h3>
                    <p className="text-vc-gold font-bold text-xs sm:text-sm mb-2 sm:mb-4">+ R$ 15.000 em 30 dias</p>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed italic">&quot;Eu não sabia nada de tráfego. Depois do Vendas Conectadas, minhas campanhas dão ROI de 5x toda semana!&quot;</p>
                  </div>

                  {/* Depoimento Texto 2 */}
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center text-center shadow-lg hover:border-vc-gold/30 transition-colors">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full mb-3 overflow-hidden border-2 border-vc-gold flex items-center justify-center shrink-0">
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80" alt="Juliana Santos" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Juliana Santos</h3>
                    <p className="text-vc-gold font-bold text-xs sm:text-sm mb-2 sm:mb-4">Clientes diários no WhatsApp</p>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed italic">&quot;Com a estratégia do Vendas Conectadas, fecho novos clientes quase diariamente direto no WhatsApp.&quot;</p>
                  </div>

                  {/* Depoimento Texto 3 */}
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center text-center shadow-lg hover:border-vc-gold/30 transition-colors">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full mb-3 overflow-hidden border-2 border-vc-gold flex items-center justify-center shrink-0">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80" alt="Marcos Silva" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Marcos Silva</h3>
                    <p className="text-vc-gold font-bold text-xs sm:text-sm mb-2 sm:mb-4">Dobrou o faturamento</p>
                    <p className="text-white/70 text-xs sm:text-sm leading-relaxed italic">&quot;Apliquei o script de Direct e hoje tenho agenda lotada para os próximos 2 meses.&quot;</p>
                  </div>

                </div>
                
                <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 opacity-60">
                  {['Consultorias', 'Mentorias', 'Resultados', 'Treinamentos'].map((tag, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-label-caps text-[10px] sm:text-xs tracking-widest uppercase">{tag}</span>
                  ))}
                </div>
              </section>

              {/* 6. Offer Section */}
              <section className="py-8 md:py-12 px-gutter relative" id="oferta">
                <div className="absolute inset-0 bg-vc-magenta/5 pointer-events-none z-0"></div>
                
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 bg-vc-gold/20 border border-vc-gold/40 px-3.5 py-1 rounded-full mb-3 reveal">
                    <span className="material-symbols-outlined text-[15px] text-vc-gold">star</span>
                    <span className="font-label-caps text-xs text-vc-gold font-bold">A MELHOR OFERTA</span>
                  </div>

                  {/* Banner Oficial Vendas Conectadas */}
                  <div className="w-full max-w-2xl mx-auto mb-4 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(255,0,255,0.15)] reveal reveal-delay-1">
                    <img 
                      src="/banner-vendas-conectadas.jpg" 
                      alt="Vendas Conectadas com Mara Camargo e Fran Martins" 
                      className="w-full h-auto object-cover block"
                    />
                  </div>
                  
                  <div className="max-w-2xl w-full mx-auto bg-black border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 text-center relative overflow-hidden shadow-[0_30px_100px_rgba(255,0,255,0.15)] group reveal-scale reveal-delay-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-vc-magenta/10 via-transparent to-vc-gold/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-vc-magenta/20 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="relative z-10">
                      <h2 className="font-display-lg text-[22px] sm:text-[26px] md:text-[30px] text-white mb-1 leading-none">Acesso Completo</h2>
                    <div className="inline-flex items-center gap-2 bg-vc-magenta/20 border border-vc-magenta/40 px-3 py-1 rounded-full mt-1 mb-3">
                      <span className="material-symbols-outlined text-[15px] text-vc-magenta">timer</span>
                      <span className="text-[11px] sm:text-[13px] font-bold text-white/90 uppercase tracking-widest">
                        Oferta expira em <span className="font-mono text-vc-gold tabular-nums ml-1">{formatTime(timeLeft)}</span>
                      </span>
                    </div>
                    <div className="mb-4 w-full max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-left">
                      {[
                        'Curso completo', 'Atualizações inclusas', 'Materiais complementares',
                        'Checklists práticos', 'Bônus exclusivos', 'Certificado de conclusão'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-vc-gold text-lg shrink-0">check_circle</span>
                          <span className="text-white/90 font-body-md text-[13px] sm:text-[14px]">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="my-2 relative">
                      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <div className="bg-black inline-block px-3 relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-0.5">
                          <p className="text-white/50 line-through text-xs font-light">De R$ 497</p>
                          <p className="font-bold text-white/90 text-xs font-label-caps tracking-widest uppercase">por apenas</p>
                        </div>
                        <div className="font-display-lg text-[28px] sm:text-[34px] md:text-[42px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-vc-gold to-[#b38f22] leading-none my-1 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                          12x R$ 20,37
                        </div>
                        <p className="text-white/60 text-xs">ou R$ 197 à vista.</p>
                      </div>
                    </div>
                    <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="w-full md:w-[85%] mx-auto text-center bg-vc-magenta text-white font-headline-md text-[14px] sm:text-[16px] md:text-[18px] py-3 px-6 rounded-xl transition-all duration-300 glow-magenta-hover font-bold shadow-[0_10px_40px_rgba(255,0,255,0.4)] mb-3 uppercase tracking-wide hover:-translate-y-0.5 block">
                      QUERO CONHECER O MÉTODO
                    </a>
                    <div className="flex items-center justify-center gap-2.5 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 w-full hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-vc-gold text-2xl">verified_user</span>
                      <div className="text-left">
                        <p className="font-bold text-white font-headline-md text-[14px] mb-0.5">Garantia Incondicional de 7 Dias.</p>
                        <p className="text-white/70 font-body-md text-xs">Seu risco é absolutamente zero.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

              {/* 12. PERGUNTAS FREQUENTES */}
              <section className="pt-6 md:pt-12 pb-12 md:pb-20 px-gutter max-w-4xl mx-auto relative border-b border-white/5" id="faq">
                <div className="text-center mb-6 sm:mb-8 relative z-10 reveal">
                  <h2 className="font-headline-lg text-[24px] sm:text-[32px] md:text-[40px] text-white mb-1.5 leading-tight">Perguntas Frequentes</h2>
                  <p className="font-body-lg text-white/60 text-xs sm:text-base md:text-lg max-w-xl mx-auto">
                    Tire todas as suas dúvidas sobre o Método Vendas Conectadas.
                  </p>
                </div>

                <div className="space-y-2.5 sm:space-y-3.5 relative z-10 reveal reveal-delay-1">
                  {[
                    { q: 'Nunca anunciei. Vou conseguir acompanhar?', a: 'Sim, o método foi desenhado passo a passo, do básico ao avançado, para que qualquer pessoa consiga aplicar.' },
                    { q: 'Preciso aparecer nas redes sociais?', a: 'Não. Temos estratégias focadas em vender todos os dias sem precisar gravar stories ou se expor.' },
                    { q: 'Funciona para quem vende serviços?', a: 'Com certeza. O método ensina a atrair interessados no seu serviço e convertê-los no WhatsApp ou Direct.' },
                    { q: 'Funciona para lojas físicas?', a: 'Sim! As estratégias de atração local são perfeitas para levar clientes qualificados até sua loja.' },
                    { q: 'Quanto preciso investir em anúncios?', a: 'Você pode começar com investimentos muito baixos (ex: R$ 6 a R$ 10 por dia) e escalar com os resultados.' },
                    { q: 'Serve para quem vende pelo WhatsApp?', a: 'Sim! O WhatsApp é nosso canal principal para fechar vendas estratégicas diariamente.' }
                  ].map((faq, idx) => (
                    <details key={idx} className="group bg-[#0a0a0a] rounded-xl border border-white/10 open:border-vc-gold/40 transition-all duration-300 hover:border-white/20 shadow-lg">
                      <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-3.5 md:p-5 text-white font-headline-md text-sm md:text-lg select-none">
                        <span className="flex items-center gap-2.5">
                          <span className="w-2 h-2 bg-vc-gold rounded-full opacity-50 group-open:opacity-100 transition-opacity shrink-0"></span> 
                          {faq.q}
                        </span>
                        <span className="transition-transform duration-300 group-open:rotate-180 text-vc-gold/70 group-open:text-vc-gold shrink-0 ml-2">
                          <span className="material-symbols-outlined text-xl md:text-2xl">expand_more</span>
                        </span>
                      </summary>
                      <div className="text-white/70 p-3.5 pt-0 md:p-5 md:pt-0 font-body-lg text-xs md:text-base pl-7 md:pl-10 leading-relaxed border-t border-white/5 mt-2">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* 13. SEÇÃO FINAL DE INSCRIÇÃO / FORMULÁRIO */}
              <section className="py-10 md:py-28 px-gutter bg-gradient-to-b from-black via-[#080808] to-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-vc-magenta/10 blur-[140px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-vc-gold/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

                <div className="max-w-xl mx-auto bg-[#0a0a0a] p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(255,0,255,0.15)] relative z-10 reveal">
                  <div className="text-center mb-6">
                    <span className="font-label-caps text-xs sm:text-label-caps text-vc-gold mb-1 sm:mb-2 inline-block tracking-widest uppercase font-bold">GARANTA SUA VAGA</span>
                    <h3 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-white mb-1.5 font-bold">Pronta para começar?</h3>
                    <p className="text-white/70 font-body-md text-xs sm:text-base">Preencha seus dados abaixo para acessar o método imediatamente.</p>
                  </div>
                  
                  <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); window.open('https://pay.kiwify.com.br/p3v2VJS', '_blank'); }}>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Seu Nome Completo" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-vc-gold/50 transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <input 
                        type="email" 
                        placeholder="Seu Melhor E-mail" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-vc-gold/50 transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <button type="submit" className="w-full bg-vc-magenta text-white font-headline-md text-base sm:text-lg py-4 sm:py-5 rounded-xl hover:bg-vc-magenta-hover transition-all duration-300 glow-magenta font-bold uppercase tracking-wide mt-2 shadow-lg hover:-translate-y-0.5 cursor-pointer">
                      QUERO ME INSCREVER AGORA
                    </button>
                  </form>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-60">
                    <span className="flex items-center gap-1.5 font-label-caps text-[11px] sm:text-xs text-white/80 tracking-wider"><span className="material-symbols-outlined text-[16px]">lock</span> PAGAMENTO SEGURO</span>
                    <span className="flex items-center gap-1.5 font-label-caps text-[11px] sm:text-xs text-white/80 tracking-wider"><span className="material-symbols-outlined text-[16px]">verified</span> ACESSO IMEDIATO</span>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>

        {/* Footer */}
        {showContent && (
          <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.4s' }}>
          <footer className="w-full py-20 bg-black border-t border-white/5 flex flex-col items-center gap-base px-gutter relative z-10 pb-32 md:pb-20">
            <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="inline-block cursor-pointer group">
              <img 
                src="/logo.png" 
                alt="Vendas Conectadas com Mara Camargo e Fran Martins" 
                className="h-10 sm:h-12 md:h-16 w-auto object-contain mb-6 opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <nav className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10">
              <a className="text-white/50 hover:text-white transition-all font-body-md text-body-md" href="/politica-privacidade.html" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
              <a className="text-white/50 hover:text-white transition-all font-body-md text-body-md" href="/termos-de-uso.html" target="_blank" rel="noopener noreferrer">Termos de Uso</a>
              <a className="text-white/50 hover:text-white transition-all font-body-md text-body-md" href="https://www.instagram.com/fran.gestora/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="text-white/50 hover:text-white transition-all font-body-md text-body-md" href="https://wa.me/5519999701829?text=Oi!%20Estou%20na%20página%20do%20Vendas%20Conectadas%20e%20tenho%20uma%20dúvida." target="_blank" rel="noopener noreferrer">Suporte</a>
            </nav>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-white/40 font-body-md text-sm md:text-body-md">
                © 2026 Vendas Conectadas. Todos os direitos reservados.
              </p>
              <p className="text-white/30 font-body-md text-xs tracking-wider">
                Desenvolvido por <a href="https://atheriumcode.com.br" target="_blank" rel="noopener noreferrer" className="text-[#a855f7] hover:text-purple-300 font-bold transition-colors hover:underline">Atherium Code</a>
              </p>
            </div>
          </footer>
          </div>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      {showContent && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-black/90 backdrop-blur-md border-t border-white/10 z-[100] md:hidden flex justify-center shadow-[0_-10px_30px_rgba(255,0,255,0.15)] animate-[slideInUp_0.5s_ease-out]">
           <a href="https://pay.kiwify.com.br/p3v2VJS" target="_blank" rel="noopener noreferrer" className="w-full bg-vc-magenta text-white font-headline-md text-[18px] py-4 rounded-xl text-center glow-magenta font-bold uppercase tracking-wide">
             Garantir Minha Vaga
           </a>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      {showContent && (
        <a href="https://wa.me/5519999701829?text=Oi!%20Estou%20na%20página%20do%20Vendas%20Conectadas%20e%20tenho%20uma%20dúvida." target="_blank" rel="noopener noreferrer" className="fixed bottom-28 md:bottom-8 right-6 z-[90] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform cursor-pointer">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
        </a>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          aria-label="Voltar ao topo"
          className="fixed bottom-28 md:bottom-8 left-6 z-[90] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1"
        >
          <span className="material-symbols-outlined text-2xl">arrow_upward</span>
        </button>
      )}
    </>
  );
}

export default App;
