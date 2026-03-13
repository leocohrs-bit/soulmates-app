import React, { useState, useEffect } from 'react';
import { ChevronRight, Lock, Mic, Circle, Zap, Heart, Palette, Moon, X } from 'lucide-react';

const SoulmatesApp = () => {
  // LocalStorage Helper Functions
  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Vibe Options
  const vibeOptions = [
    { id: 'peaceful', icon: Circle, label: 'Friedlich' },
    { id: 'energized', icon: Zap, label: 'Energiegeladen' },
    { id: 'grateful', icon: Heart, label: 'Dankbar' },
    { id: 'creative', icon: Palette, label: 'Kreativ' },
    { id: 'reflective', icon: Moon, label: 'Nachdenklich' }
  ];

  // Default Data
  const defaultEntries = [
    {
      id: 1, 
      date: "20. Feb 2026", 
      vibe: vibeOptions[2], 
      privacy: "private",
      type: "image",
      text: "Heute am Eisbach gewesen. Die ersten Surfer sind schon wieder da. Es fühlt sich gut an, die Stadt wieder zum Leben erwachen zu sehen.",
      image: "https://images.unsplash.com/photo-1595581582159-7f85219f6c1d?w=800&q=80",
      hasVoice: false
    },
    {
      id: 2, 
      date: "19. Feb 2026", 
      vibe: vibeOptions[4], 
      privacy: "bubble",
      type: "audio",
      text: "Manchmal denke ich darüber nach, wie schnell sich alles ändert. Aber auch: wie viel gleich bleibt.",
      hasVoice: true
    },
    {
      id: 3, 
      date: "17. Feb 2026", 
      vibe: vibeOptions[0], 
      privacy: "private",
      type: "link",
      text: "Spaziergang durch Schwabing. Dieser Artikel hat mich inspiriert.",
      link: {
        title: "The Art of Slow Living in Fast Cities",
        url: "urban-journal.com/slow-living"
      }
    }
  ];

  const defaultConversations = [
    {
      id: 1,
      name: "MAX",
      location: "MAXVORSTADT",
      lastMessage: "Lust auf einen Espresso am Odeonsplatz nach der Vorlesung?",
      time: "14:02",
      messages: [
        { sender: 'max', text: 'Hey! Hast du meinen Post über die Hinterhöfe gesehen?', time: '13:45' },
        { sender: 'me', text: 'Ja! Absolut nachvollziehbar. Die Stille dort ist wirklich besonders.', time: '13:50' },
        { sender: 'max', text: 'Lust auf einen Espresso am Odeonsplatz nach der Vorlesung?', time: '14:02' }
      ]
    },
    {
      id: 2,
      name: "SOPHIA",
      location: "SENDLING",
      lastMessage: "Dein Beitrag zum Isar-Rauschen war pure Poesie.",
      time: "Gestern",
      messages: [
        { sender: 'sophia', text: 'Dein Beitrag zum Isar-Rauschen war pure Poesie.', time: 'Gestern 18:23' },
        { sender: 'me', text: 'Danke! Das bedeutet mir viel.', time: 'Gestern 19:15' }
      ]
    },
    {
      id: 3,
      name: "JULIAN",
      location: "LEHEL",
      lastMessage: "Hast du die neue Ausstellung in der Pinakothek schon gesehen?",
      time: "Montag",
      messages: [
        { sender: 'julian', text: 'Hast du die neue Ausstellung in der Pinakothek schon gesehen?', time: 'Montag 16:30' }
      ]
    }
  ];

  const defaultPollOptions = [
    { id: 'isar', text: 'ISAR-RAUSCHEN', votes: 18 },
    { id: 'oper', text: 'OPERN-GLANZ', votes: 11 }
  ];

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('feed');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState('audio');
  const [selectedImage, setSelectedImage] = useState(null);
  const [coreExpanded, setCoreExpanded] = useState(false);
  
  // Journal State with localStorage
  const [myEntries, setMyEntries] = useState(() => loadFromStorage('myEntries', defaultEntries));
  const [entryText, setEntryText] = useState('');
  const [entryPrivacy, setEntryPrivacy] = useState('bubble');
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingWaveform, setRecordingWaveform] = useState([0.3, 0.5, 0.4, 0.6, 0.5, 0.7, 0.6, 0.4]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  
  // Friends State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentCard, setCurrentCard] = useState(1);
  
  // Messaging State with localStorage
  const [conversations, setConversations] = useState(() => loadFromStorage('conversations', defaultConversations));
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Feed State with localStorage
  const [pollOptions, setPollOptions] = useState(() => loadFromStorage('pollOptions', defaultPollOptions));
  const [pollVote, setPollVote] = useState(() => loadFromStorage('pollVote', null));
  const [resonated, setResonated] = useState(() => loadFromStorage('resonated', {}));

  const dailyFocus = "SURVIVING MONDAY WITHOUT AN APEROL";
  const currentDate = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  const coreThemes = [
    "High Achiever Solitude",
    "Isar-Resonanz",
    "Urban Mysticism"
  ];

  const wordCloud = [
    "RESILIENCE", "ISAR-VIBES", "MAXVORSTADT-GEFLÜSTER",
    "DEEP FOCUS", "CONNECTION", "STILLE", "AMBITION", "URBAN POETRY"
  ];

  const bubbleMembers = [
    {
      id: 1, 
      name: "Sarah Müller", 
      avatar: "SM",
      basics: {
        spitzname: "Sari",
        geburtstag: "15. März 1992 (Fische)",
        wohnort: "München-Schwabing",
        projekt: "UX Design für nachhaltige Startups",
        dreiWorte: "Neugierig. Bedacht. Empathisch."
      },
      lifestyle: {
        filmSerie: "The Bear – weil es zeigt, dass Perfektion nicht das Ziel ist",
        hobbies: "Urban Sketching in Cafés, Yoga am Morgen",
        guiltyPleasure: "TikTok-Videos über Innenarchitektur um 2 Uhr nachts",
        lieblingsort: "Die Isar bei Sonnenuntergang, wenn das Licht golden wird",
        superkraft: "Menschen zum Nachdenken bringen, ohne zu belehren",
        morgenmensch: "Morgenmensch – aber nur mit gutem Kaffee",
        ick: "Ungeduld und Oberflächlichkeit",
        romanEmpire: "Die Kunst des Nichtstuns – warum es so schwer ist, einfach mal zu sein"
      }
    },
    {
      id: 2, 
      name: "Michael König", 
      avatar: "MK",
      basics: {
        spitzname: "Michi",
        geburtstag: "8. Juli 1989 (Krebs)",
        wohnort: "München-Giesing",
        projekt: "Nachhaltigkeits-Podcast",
        dreiWorte: "Reflektiert. Ehrlich. Tiefgründig."
      },
      lifestyle: {
        filmSerie: "Chef's Table – die Philosophie hinter dem Essen",
        hobbies: "Vinyl sammeln, Wandern in den Bergen",
        guiltyPleasure: "Stundenlang YouTube-Videos über Schallplatten schauen",
        lieblingsort: "Der Englische Garten am frühen Morgen, wenn noch niemand da ist",
        superkraft: "Eine Parklücke in Schwabing in unter 2 Minuten finden",
        morgenmensch: "Definitiv Morgenmensch – die Welt ist dann ehrlicher",
        ick: "Lärm ohne Substanz",
        romanEmpire: "Warum Menschen sich selbst im Weg stehen – mich eingeschlossen"
      }
    },
    {
      id: 3, 
      name: "Lisa Weber", 
      avatar: "LW",
      basics: {
        spitzname: "Lisi",
        geburtstag: "22. November 1994 (Skorpion)",
        wohnort: "München-Maxvorstadt",
        projekt: "Kunstgeschichte & Kulturvermittlung",
        dreiWorte: "Sensibel. Beobachtend. Leidenschaftlich."
      },
      lifestyle: {
        filmSerie: "Portrait of a Lady on Fire – pure Ästhetik und Emotion",
        hobbies: "Alte Bücher sammeln, Aquarellmalerei",
        guiltyPleasure: "Trash-TV beim Bügeln – die Ironie ist nicht verloren gegangen",
        lieblingsort: "Museen an Regentagen – die perfekte Melancholie",
        superkraft: "Schönheit in den kleinsten Dingen entdecken",
        morgenmensch: "Nachteule – die Nacht gehört den Träumern",
        ick: "Menschen, die in Cafés Zoom-Calls ohne Kopfhörer führen",
        romanEmpire: "Die Balance zwischen Ehrgeiz und Zufriedenheit – wann ist genug wirklich genug?"
      }
    }
  ];

  const feedPosts = [
    {
      id: 1,
      author: "SARAH",
      location: "SCHWABING",
      timestamp: "2H AGO",
      text: "München glänzt. Die Start-ups, die Agenturen, die Networking-Events. Aber manchmal vermisse ich einfach nur: Tiefe. Ein Gespräch, das über Portfolios und Growth-Strategien hinausgeht. Jemanden, der versteht, dass Erfolg nicht immer laut sein muss.",
      image: "https://images.unsplash.com/photo-1559564484-e48fc3c0b87d?w=600&q=80",
      resonances: resonated[1] ? 13 : 12,
      hasAudio: true
    },
    {
      id: 2,
      author: "JONAS",
      location: "LEHEL",
      timestamp: "3H AGO",
      text: "Mein heutiger Ick: Leute, die am Odeonsplatz so tun, als wären sie in Mailand, aber dann an der U-Bahn drängeln wie bei der Wiesn. Die kognitive Dissonanz ist real.",
      resonances: resonated[2] ? 25 : 24,
      hasAudio: false
    },
    {
      id: 3,
      author: "MICHAEL",
      location: "GIESING",
      timestamp: "4H AGO",
      text: "Mein Roman Empire sind die Hinterhöfe in der Maxvorstadt. Diese versteckten grünen Inseln zwischen den Altbauten – als wären sie ein Geheimnis, das nur die Stadt mit dir teilt. Manchmal gehe ich absichtlich Umwege, nur um durch diese stillen Durchgänge zu laufen.",
      resonances: resonated[3] ? 19 : 18,
      hasAudio: false
    },
    {
      id: 4,
      author: "LENA",
      location: "MAXVORSTADT",
      timestamp: "6H AGO",
      text: "Ehrliche Beichte: Ich bin für den High-End-Look hier, trage Bio-Baumwolle und trinke Oat Milk Matcha. Aber mein Herz schlägt für die Leberkassemmel vom Discounter um die Ecke. Guilty Pleasure auf höchstem Niveau.",
      resonances: resonated[4] ? 32 : 31,
      hasAudio: false
    },
    {
      id: 5,
      author: "ANNA",
      location: "NEUHAUSEN",
      timestamp: "8H AGO",
      text: "Nach zehn Stunden im Büro sitze ich an der Isar und starre einfach nur aufs Wasser. Keine To-Do-Liste, kein LinkedIn-Scroll. Nur das Rauschen. Und irgendwie fühlt sich das wertvoller an als jedes Meeting heute.",
      resonances: resonated[5] ? 10 : 9,
      hasAudio: true
    },
    {
      id: 6,
      author: "LISA",
      location: "MAXVORSTADT",
      timestamp: "1D AGO",
      text: "Es gibt Menschen, die Museen besuchen, um Kunst zu sehen. Und dann gibt es die, die hingehen, um sich selbst zu finden. Die Pinakothek der Moderne an einem Regentag – das ist mein Safe Space.",
      resonances: resonated[6] ? 8 : 7,
      hasAudio: false
    }
  ];

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage('myEntries', myEntries);
  }, [myEntries]);

  useEffect(() => {
    saveToStorage('conversations', conversations);
  }, [conversations]);

  useEffect(() => {
    saveToStorage('pollOptions', pollOptions);
  }, [pollOptions]);

  useEffect(() => {
    saveToStorage('pollVote', pollVote);
  }, [pollVote]);

  useEffect(() => {
    saveToStorage('resonated', resonated);
  }, [resonated]);

  // Helper Functions
  const getPollPercentages = () => {
    const total = pollOptions.reduce((sum, opt) => sum + opt.votes, 0);
    return pollOptions.map(opt => ({
      ...opt,
      percentage: Math.round((opt.votes / total) * 100)
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const startRecording = () => {
    setIsRecording(true);
    setHasRecording(false);
    setRecordingTime(0);
    
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    const waveInterval = setInterval(() => {
      setRecordingWaveform(prev => prev.map(() => Math.random() * 0.8 + 0.2));
    }, 150);
    
    window.recordingIntervals = { interval, waveInterval };
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    
    if (window.recordingIntervals) {
      clearInterval(window.recordingIntervals.interval);
      clearInterval(window.recordingIntervals.waveInterval);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEntry = () => {
    if (!entryText.trim() && !hasRecording && !uploadedImage && !linkUrl) {
      alert('Bitte füge mindestens einen Inhalt hinzu');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' }),
      vibe: selectedVibe ? vibeOptions.find(v => v.id === selectedVibe) : vibeOptions[0],
      privacy: entryPrivacy,
      type: selectedContentType,
      text: entryText,
      hasVoice: hasRecording
    };

    if (selectedContentType === 'photo' && uploadedImage) {
      newEntry.image = uploadedImage;
    }

    if (selectedContentType === 'link' && linkUrl) {
      newEntry.link = {
        title: linkTitle || linkUrl,
        url: linkUrl
      };
    }

    setMyEntries([newEntry, ...myEntries]);
    
    // Reset form
    setShowNewEntry(false);
    setEntryText('');
    setSelectedVibe(null);
    setHasRecording(false);
    setIsRecording(false);
    setRecordingTime(0);
    setUploadedImage(null);
    setLinkUrl('');
    setLinkTitle('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat) {
        const newMsg = {
          sender: 'me',
          text: newMessage,
          time: getCurrentTime()
        };
        
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage,
          time: 'Jetzt'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setNewMessage('');
  };

  const handlePollVote = (optionId) => {
    if (pollVote) return; // Already voted
    
    const updatedOptions = pollOptions.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });
    
    setPollOptions(updatedOptions);
    setPollVote(optionId);
  };

  const handleConnect = (author) => {
    setActiveTab('messaging');
    const authorUpper = author.toUpperCase();
    const chat = conversations.find(c => c.name === authorUpper);
    if (chat) {
      setSelectedChat(chat.id);
    }
  };

  const pollResults = getPollPercentages();
  const dominantChoice = pollResults[0].percentage > pollResults[1].percentage ? pollResults[0] : pollResults[1];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.recordingIntervals) {
        clearInterval(window.recordingIntervals.interval);
        clearInterval(window.recordingIntervals.waveInterval);
      }
    };
  }, []);

  // ==================== FEED VIEW ====================
  const Feed = () => (
    <div className="space-y-0">
      <div className="text-center py-8 mb-8 border-b border-slate-100">
        <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-3">Today's Focus</p>
        <h2 className="font-serif text-xl text-black tracking-tight uppercase mb-4">
          {dailyFocus}
        </h2>
        <div className="flex items-center justify-center space-x-4 text-[8px] text-slate-400 tracking-wider">
          <span>{currentDate}</span>
          <span>·</span>
          <span className="font-mono">48.1351° N, 11.5820° E</span>
        </div>
      </div>

      <div className="border-[0.5px] border-black p-6 my-4">
        <p className="font-serif text-xl italic text-black mb-6 leading-relaxed">
          Was bewegt dich mehr in München?
        </p>
        
        <div className="space-y-0">
          {pollResults.map((option, idx) => {
            const isSelected = pollVote === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handlePollVote(option.id)}
                disabled={!!pollVote}
                className={`w-full p-5 text-left transition-all ${
                  idx > 0 ? 'border-t-[0.5px] border-black' : ''
                } ${isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'} ${
                  pollVote ? 'cursor-default' : 'cursor-pointer'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black tracking-widest uppercase">{option.text}</span>
                  {pollVote && (
                    <span className="text-xs tracking-widest font-mono text-slate-600">
                      {option.percentage}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-b border-slate-100 bg-white mb-8">
        <button 
          onClick={() => setCoreExpanded(!coreExpanded)}
          className="w-full py-6 px-0 hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-2xl text-black tracking-tight">OBVS Core</h3>
            <p className="text-[8px] text-slate-400 tracking-wider font-mono">48.1351° N, 11.5820° E</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-widest text-slate-400">
              {coreExpanded ? 'Minimieren' : 'The Deep Dive'}
            </p>
            <ChevronRight 
              size={16} 
              strokeWidth={1}
              className={`text-slate-400 transition-transform duration-300 ${coreExpanded ? 'rotate-90' : ''}`} 
            />
          </div>
        </button>

        <div 
          className={`transition-all duration-300 ease-in-out ${
            coreExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ overflow: 'hidden' }}>
          <div className="py-6 border-t border-slate-100 space-y-6">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4">Diese Woche im Fokus</p>
              <div className="space-y-3">
                {coreThemes.map((theme, idx) => (
                  <p key={idx} className="font-serif text-base text-black leading-relaxed">
                    {theme}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4">Was uns bewegt</p>
              <div className="flex flex-wrap gap-3">
                {wordCloud.map((word, idx) => (
                  <span key={idx} className="text-black text-sm font-medium tracking-wide">
                    {word}
                    {idx < wordCloud.length - 1 && <span className="text-slate-300 ml-3">·</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4">Latest Resonance</p>
              <p className="font-serif text-base text-black leading-relaxed">
                {dominantChoice.percentage}% WÄHLEN {dominantChoice.id === 'isar' ? 'ISAR-RAUSCHEN' : 'OPERN-GLANZ'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {feedPosts.map((post, idx) => (
        <article key={post.id} className={`py-6 ${idx > 0 ? 'border-t border-slate-100' : ''}`}>
          <header className="flex items-start justify-between mb-4">
            <div>
              <p className="text-black font-medium text-sm tracking-wide">{post.author} / {post.location}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[9px] tracking-wider">{post.timestamp}</p>
              <p className="text-[8px] text-slate-400 tracking-wider font-mono mt-0.5">48.1351° N, 11.5820° E</p>
            </div>
          </header>
          
          <p className="font-serif text-base text-black leading-relaxed mb-4">
            {post.text}
          </p>

          {post.image && (
            <div className="mb-4 -mx-1 overflow-hidden cursor-pointer group">
              <img 
                src={post.image}
                alt=""
                className="w-full h-auto filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <p className="text-[8px] text-slate-400 mt-2 uppercase tracking-wider text-center">
                Hover to view in color
              </p>
            </div>
          )}
          
          <footer className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const newResonated = { ...resonated, [post.id]: !resonated[post.id] };
                setResonated(newResonated);
              }}
              className="text-[9px] uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
              {resonated[post.id] ? 'RESONATED' : 'RESONATE'}
            </button>
            <span className="text-slate-300">·</span>
            <button 
              onClick={() => handleConnect(post.author)}
              className="text-[9px] uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
              CONNECT
            </button>
            <span className="text-slate-300">·</span>
            <span className="text-[9px] text-slate-400">{post.resonances}</span>
            {post.hasAudio && (
              <>
                <span className="text-slate-300">·</span>
                <Mic size={10} strokeWidth={1} className="text-slate-400" />
              </>
            )}
          </footer>
        </article>
      ))}
    </div>
  );

  // ==================== JOURNAL VIEW ====================
  const Journal = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-3xl text-black tracking-tight">Multimedia Journal</h2>
        <p className="text-[8px] text-slate-400 tracking-wider font-mono">48.1351° N, 11.5820° E</p>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowContentMenu(!showContentMenu)}
          className="w-full border border-black text-black py-4 hover:bg-slate-50 transition-all">
          <span className="text-xs tracking-widest uppercase font-medium">+ ADD CONTENT</span>
        </button>
        
        {showContentMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black z-10 shadow-lg">
            {[
              { type: 'audio', label: 'AUDIO' },
              { type: 'photo', label: 'PHOTO' },
              { type: 'video', label: 'VIDEO' },
              { type: 'link', label: 'LINK' }
            ].map((item, idx) => (
              <button
                key={item.type}
                onClick={() => {
                  setSelectedContentType(item.type);
                  setShowNewEntry(true);
                  setShowContentMenu(false);
                }}
                className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                  idx > 0 ? 'border-t border-slate-100' : ''
                }`}>
                <span className="text-xs tracking-widest uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-0">
        {myEntries.map((entry, idx) => (
          <div key={entry.id} className={`py-6 ${idx > 0 ? 'border-t border-slate-100' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <entry.vibe.icon size={16} strokeWidth={1} className="text-slate-400" />
                <div>
                  <p className="text-black font-medium text-sm">{entry.date}</p>
                  <p className="text-slate-400 text-xs flex items-center space-x-2 mt-1">
                    {entry.privacy === 'private' ? (
                      <><Lock size={10} strokeWidth={1} /><span>Privat</span></>
                    ) : (
                      <span>Bubble</span>
                    )}
                  </p>
                </div>
              </div>
              {entry.hasVoice && <Mic size={12} strokeWidth={1} className="text-slate-400" />}
            </div>
            
            <p className="font-serif text-base text-black leading-relaxed mb-4">{entry.text}</p>

            {entry.type === 'image' && entry.image && (
              <div className="mb-4 overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(entry.image)}>
                <img 
                  src={entry.image}
                  alt="Journal moment"
                  className="w-full h-auto filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <p className="text-[8px] text-slate-400 mt-2 uppercase tracking-wider text-center">
                  Tap to view in color
                </p>
              </div>
            )}

            {entry.type === 'photo' && entry.image && (
              <div className="mb-4 overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(entry.image)}>
                <img 
                  src={entry.image}
                  alt="Journal moment"
                  className="w-full h-auto filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <p className="text-[8px] text-slate-400 mt-2 uppercase tracking-wider text-center">
                  Tap to view in color
                </p>
              </div>
            )}

            {entry.type === 'link' && entry.link && (
              <div className="border border-slate-200 p-6 my-4 hover:border-black transition-colors cursor-pointer">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 mb-3">SAVED LINK</p>
                <h4 className="font-serif text-lg text-black mb-2 leading-tight">
                  {entry.link.title}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {entry.link.url}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" 
          onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity" 
            onClick={() => setSelectedImage(null)}>
            <X size={32} strokeWidth={1} />
          </button>
          <img 
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {showNewEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-black">Neuer Eintrag</h3>
              <button 
                onClick={() => { 
                  setShowNewEntry(false); 
                  setHasRecording(false); 
                  setIsRecording(false); 
                  setRecordingTime(0);
                  setUploadedImage(null);
                  setLinkUrl('');
                  setLinkTitle('');
                  setEntryText('');
                }}
                className="text-black hover:opacity-60">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="mb-6 border border-slate-100 p-6">
              <p className="text-black font-medium mb-4 text-xs uppercase tracking-widest">Sichtbarkeit</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setEntryPrivacy('private')}
                  className={`p-4 border transition-colors ${
                    entryPrivacy === 'private' ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  <Lock size={20} strokeWidth={1} className="mx-auto mb-2" />
                  <p className="text-xs font-semibold">Privat</p>
                </button>
                <button 
                  onClick={() => setEntryPrivacy('bubble')}
                  className={`p-4 border transition-colors ${
                    entryPrivacy === 'bubble' ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  <p className="text-xs font-semibold">Bubble</p>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-black font-medium mb-4 block text-xs uppercase tracking-widest">Stimmung</label>
              <div className="grid grid-cols-5 gap-2">
                {vibeOptions.map(vibe => (
                  <button 
                    key={vibe.id} 
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`p-3 border transition-colors ${
                      selectedVibe === vibe.id ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <vibe.icon size={18} strokeWidth={1} className="mx-auto mb-1" />
                    <span className="text-[8px] block">{vibe.label}</span>
                  </button>
                ))}
              </div>

              {selectedContentType === 'audio' && (
                <div className="mt-6 border border-slate-100 p-6">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4 text-center">
                    {isRecording ? 'REC' : 'Audio Recording'}
                  </p>
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center">
                      {isRecording && (
                        <>
                          <div className="absolute w-20 h-20 border border-black rounded-full opacity-20 animate-ping"></div>
                          <div className="absolute w-20 h-20 border border-black rounded-full opacity-10 animate-pulse"></div>
                        </>
                      )}
                      <button 
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all z-10 border ${
                          isRecording 
                            ? 'border-2 border-black bg-white' 
                            : 'border border-slate-300 bg-white hover:border-black'
                        }`}>
                        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-black' : 'bg-slate-400'}`}></div>
                      </button>
                    </div>

                    {isRecording && (
                      <div className="w-full max-w-[280px]">
                        <div className="flex items-center justify-center space-x-1 h-12">
                          {recordingWaveform.map((height, idx) => (
                            <div 
                              key={idx} 
                              className="w-0.5 bg-black transition-all duration-200"
                              style={{ height: `${height * 100}%` }} 
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {(isRecording || hasRecording) && (
                      <div className="text-center">
                        <p className="text-black font-semibold text-lg tabular-nums">{formatTime(recordingTime)}</p>
                        <p className="text-slate-400 text-xs">{isRecording ? 'Aufnahme läuft' : 'Aufnahme beendet'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedContentType === 'photo' && (
                <div className="mt-6 border border-slate-100 p-6">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4 text-center">
                    Upload Photo
                  </p>
                  {uploadedImage ? (
                    <div className="relative">
                      <img src={uploadedImage} alt="Upload preview" className="w-full h-auto filter grayscale" />
                      <button 
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-slate-100">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 p-8 text-center hover:border-black transition-colors cursor-pointer block">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <p className="text-sm text-slate-500">Click to upload image</p>
                      <p className="text-xs text-slate-400 mt-2">Will be displayed in B/W by default</p>
                    </label>
                  )}
                </div>
              )}

              {selectedContentType === 'link' && (
                <div className="mt-6 border border-slate-100 p-6">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4">Save Link</p>
                  <input 
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Paste URL..."
                    className="w-full border-b border-slate-300 pb-2 text-sm focus:outline-none focus:border-black mb-4"
                  />
                  <input 
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Link title (optional)"
                    className="w-full border-b border-slate-300 pb-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              )}

              {selectedContentType === 'video' && (
                <div className="mt-6 border border-slate-100 p-6">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-4 text-center">
                    Upload Video
                  </p>
                  <div className="border-2 border-dashed border-slate-300 p-8 text-center hover:border-black transition-colors cursor-pointer">
                    <p className="text-sm text-slate-500">Video upload coming soon</p>
                    <p className="text-xs text-slate-400 mt-2">[ PLAY ] control in B/W</p>
                  </div>
                </div>
              )}

              <textarea 
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Was bewegt dich gerade?"
                className="w-full px-4 py-4 border border-slate-200 text-sm resize-none mt-6 focus:outline-none focus:border-black" 
                rows="4" 
              />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => { 
                  setShowNewEntry(false); 
                  setHasRecording(false); 
                  setIsRecording(false);
                  setUploadedImage(null);
                  setLinkUrl('');
                  setLinkTitle('');
                  setEntryText('');
                }}
                className="flex-1 py-3 border border-slate-300 text-black text-sm hover:bg-slate-50 transition-colors">
                Abbrechen
              </button>
              <button 
                onClick={handleSaveEntry}
                className="flex-1 py-3 bg-black text-white text-sm hover:bg-slate-800 transition-colors">
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==================== FRIENDS VIEW ====================
  const Friends = () => {
    const basicsFields = [
      { key: 'spitzname', label: 'Spitzname' },
      { key: 'geburtstag', label: 'Geburtstag / Sternzeichen' },
      { key: 'wohnort', label: 'Wohnort' },
      { key: 'projekt', label: 'Beruf / Projekt' },
      { key: 'dreiWorte', label: 'Drei beschreibende Worte' }
    ];

    const lifestyleFields = [
      { key: 'filmSerie', label: 'Film / Serie' },
      { key: 'hobbies', label: 'Hobbies' },
      { key: 'guiltyPleasure', label: 'Guilty Pleasure' },
      { key: 'lieblingsort', label: 'Lieblingsort' },
      { key: 'superkraft', label: 'Superkraft' },
      { key: 'morgenmensch', label: 'Morgenmensch / Nachteule' },
      { key: 'ick', label: 'Ick' },
      { key: 'romanEmpire', label: 'Roman Empire' }
    ];

    if (selectedProfile) {
      const member = bubbleMembers.find(m => m.id === selectedProfile);
      
      return (
        <div className="space-y-8 py-4">
          <button 
            onClick={() => { 
              setSelectedProfile(null); 
              setCurrentCard(1); 
            }}
            className="text-black hover:opacity-60 transition-opacity text-[9px] uppercase tracking-widest">
            ← Zurück
          </button>

          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentCard - 1) * 100}%)` }}>
              
              <div className="min-w-full border border-slate-100 bg-white py-10 px-10">
                <div className="flex items-start justify-between mb-10 pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 border border-black rounded-full flex items-center justify-center font-serif text-2xl">
                      {member.avatar}
                    </div>
                    <h2 className="font-serif text-4xl text-black tracking-tight">{member.name}</h2>
                  </div>
                  <p className="text-[8px] text-slate-400 tracking-wider font-mono">
                    48.1351° N<br />11.5820° E
                  </p>
                </div>

                <h3 className="text-[9px] uppercase tracking-widest text-slate-400 mb-8">Die Basics</h3>
                <div className="space-y-6">
                  {basicsFields.map(({ key, label }) => (
                    <div key={key}>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">{label}</p>
                      <p className="font-serif text-base text-black leading-relaxed">{member.basics[key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-full border border-slate-100 bg-white py-10 px-10">
                <div className="flex items-start justify-between mb-10 pb-6 border-b border-slate-100">
                  <h3 className="text-[9px] uppercase tracking-widest text-slate-400">Persönliches & Lifestyle</h3>
                  <p className="text-[8px] text-slate-400 tracking-wider font-mono">
                    48.1351° N<br />11.5820° E
                  </p>
                </div>

                <div className="space-y-6">
                  {lifestyleFields.map(({ key, label }) => (
                    <div key={key}>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">{label}</p>
                      <p className="font-serif text-base text-black leading-relaxed">{member.lifestyle[key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button 
              onClick={() => setCurrentCard(1)} 
              disabled={currentCard === 1}
              className={`text-[9px] uppercase tracking-widest transition-opacity ${
                currentCard === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-60'
              }`}>
              ← Basics
            </button>

            <div className="flex space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full ${currentCard === 1 ? 'bg-black' : 'bg-slate-300'}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${currentCard === 2 ? 'bg-black' : 'bg-slate-300'}`} />
            </div>

            <button 
              onClick={() => setCurrentCard(2)} 
              disabled={currentCard === 2}
              className={`text-[9px] uppercase tracking-widest transition-opacity ${
                currentCard === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-60'
              }`}>
              Lifestyle →
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl text-black tracking-tight">Friend Book</h2>
          <p className="text-[8px] text-slate-400 tracking-wider font-mono">48.1351° N, 11.5820° E</p>
        </div>

        <div className="space-y-0">
          {bubbleMembers.map((member, idx) => (
            <button 
              key={member.id} 
              onClick={() => { 
                setSelectedProfile(member.id); 
                setCurrentCard(1); 
              }}
              className={`w-full text-left py-6 hover:bg-slate-50 transition-colors ${
                idx > 0 ? 'border-t border-slate-100' : ''
              }`}>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 border border-black rounded-full flex items-center justify-center font-serif text-lg">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-serif text-xl text-black tracking-tight">{member.name}</p>
                  <p className="text-slate-500 text-sm">{member.basics.wohnort}</p>
                </div>
                <ChevronRight size={16} strokeWidth={1} className="text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ==================== MESSAGING VIEW ====================
  const Messaging = () => {
    if (selectedChat) {
      const chat = conversations.find(c => c.id === selectedChat);
      
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedChat(null)}
                className="text-[9px] uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
                ← BACK
              </button>
              <div>
                <h2 className="font-serif text-2xl text-black tracking-tight">{chat.name}</h2>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">{chat.location}</p>
              </div>
            </div>
            <p className="text-[8px] text-slate-400 tracking-wider font-mono">48.1351° N, 11.5820° E</p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto mb-6">
            {chat.messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === 'me' ? 'text-right' : 'text-left'}>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">
                  {msg.sender === 'me' ? 'ME' : chat.name}:
                </p>
                <p className="font-serif text-base text-black leading-relaxed inline-block max-w-[85%] text-left">
                  {msg.text}
                </p>
                <p className="text-[8px] text-slate-400 mt-1">{msg.time}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="TYPE A MESSAGE..."
                className="w-full border-b border-slate-300 pb-3 text-sm focus:outline-none focus:border-black tracking-wide"
              />
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl text-black tracking-tight">Direct Messages</h2>
          <p className="text-[8px] text-slate-400 tracking-wider font-mono">48.1351° N, 11.5820° E</p>
        </div>

        {conversations.map((chat, idx) => (
          <button 
            key={chat.id} 
            onClick={() => setSelectedChat(chat.id)}
            className={`w-full text-left py-6 hover:bg-slate-50 transition-colors ${
              idx > 0 ? 'border-t border-slate-100' : ''
            }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-serif text-xl text-black font-semibold mb-1 tracking-tight">
                  {chat.name} / {chat.location}
                </p>
                <p className="text-sm text-slate-500">{chat.lastMessage}</p>
              </div>
              <p className="text-[9px] text-slate-400 tracking-wider">{chat.time}</p>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // ==================== MAIN APP ====================
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        .font-serif { font-family: 'Crimson Pro', serif; }
      `}</style>

      <div className="flex flex-col h-screen max-w-md w-full bg-white border border-slate-100 shadow-xl">
        <div className="flex-none bg-white border-b border-slate-100 px-6 py-6">
          <h1 className="font-serif text-2xl text-black text-center tracking-wide">Soulmates</h1>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            {activeTab === 'feed' && <Feed />}
            {activeTab === 'journal' && <Journal />}
            {activeTab === 'friends' && <Friends />}
            {activeTab === 'messaging' && <Messaging />}
          </div>
        </div>

        <div className="flex-none bg-white border-t border-slate-100 px-4 py-6">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`text-[10px] uppercase tracking-[0.2em] py-2 transition-all ${
                activeTab === 'feed' ? 'text-black font-semibold' : 'text-slate-400'
              }`}>
              01 FEED
            </button>
            <button 
              onClick={() => setActiveTab('journal')}
              className={`text-[10px] uppercase tracking-[0.2em] py-2 transition-all ${
                activeTab === 'journal' ? 'text-black font-semibold' : 'text-slate-400'
              }`}>
              02 JOURNAL
            </button>
            <button 
              onClick={() => setActiveTab('friends')}
              className={`text-[10px] uppercase tracking-[0.2em] py-2 transition-all ${
                activeTab === 'friends' ? 'text-black font-semibold' : 'text-slate-400'
              }`}>
              03 FRIENDS
            </button>
            <button 
              onClick={() => setActiveTab('messaging')}
              className={`text-[10px] uppercase tracking-[0.2em] py-2 transition-all ${
                activeTab === 'messaging' ? 'text-black font-semibold' : 'text-slate-400'
              }`}>
              04 DIRECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoulmatesApp;
