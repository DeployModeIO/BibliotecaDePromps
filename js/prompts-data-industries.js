// Auto-fixed by scripts/debug-industries.js
const PROMPTS_DB_INDUSTRIES = {
  'categorias': [
    {
      'id': 'salud',
      'nombre': 'Salud y Medicina',
      'icono': '🏥',
      'color': '#e91e63',
      'descripcion': 'Hospital, urgencias, telemedicina, especialidades',
      'subcategorias': [
        {
          'id': 'salud_urg',
          'nombre': 'Urgencias Emergencias',
          'prompts': [
            {
              'id': 's_u_001',
              'titulo': 'Triage Automatizado con IA Predictiva',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'IA',
                'triage',
                'emergencias'
              ],
              'prompt': 'ACTÚA COMO Especialista en medicina emergencias e inteligencia artificial con 15 anos.\n\nCONTEXTO Servicio de urgencias necesita sistema triage inteligente usando ML para predecir criticidad basandose en sintomas signos vitales.\n\nTAREA Desarrolla app de triage IA.\nMÓDULOS: Formulario sintomas algoritmo ML scoring riesgo dashboard flujo alertas medicos.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_u_002',
              'titulo': 'Sistema de Resucitación Guiado Digital RCP ACLS',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'critica',
              'uso': 'Emergencia',
              'tags': [
                'RCP',
                'ACLS',
                'BLS',
                'PALS'
              ],
              'prompt': 'ACTÚA COMO Instructor ACLS/ATLS PHTLS 20 anos.\n\nCONTEXTO App guiando equipos medicos paso-a-paso durante protocolos resucitacion.\n\nMÓDULOS: Protocolos BLS ACLS PALS timers medicos dosificador calculadoras defibrilacion documentation.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_u_003',
              'titulo': 'Gestión Masacre Desastre MCI Mass Casualty',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Emergencia',
              'tags': [
                'MCI',
                'desastres',
                'evacuacion'
              ],
              'prompt': 'ACTÚA COMO Coordinador respuesta desastres humanitarios 18 anos.\n\nCONTEXTO App gestionar incidentes multiples victimas simultaneos.\nMÓDULOS: Triage masivo etiquetas evacuacion recursos coordination logistica.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_u_004',
              'titulo': 'Centro Toxicologico Intoxicaciones Antidotos',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Según necesidad',
              'tags': [
                'toxicologia',
                'antidotos',
                'intoxicaciones'
              ],
              'prompt': 'ACTÚA COMO Toxicólogo clinico 15 anos.\nMÓDULOS: Search sustancia antidote dosing decontamination weight-based dose calculator poison control integration.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_u_005',
              'titulo': 'Registro de Trauma Major Trauma Registry ISS TRISS',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'trauma',
                'GCS',
                'ISS',
                'TRISS'
              ],
              'prompt': 'ACTÚA COMO Trauma surgeon Level I center director 20 anos.\nMÓDULOS: Primary survey ABCDE GCS ISS TRISS prediction operative interventions outcomes tracking quality improvement.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'salud_hospital',
          'nombre': 'Gestión Hospitalaria Avanzada',
          'prompts': [
            {
              'id': 's_h_001',
              'titulo': 'Sistema Gestión Farmacia Hospitalaria Inteligente',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'farmacia',
                'hospital',
                'medicamentos',
                'automatizacion dispensacion'
              ],
              'prompt': 'ACTÚA COMO farmacéutico clinico hospitalario 20 anos gerenciando farmacia 450 cama.\nMÓDULOS: Dispensacion individualizada robotic arms medication orders verification drug-drug interactions allergies renal/hepatic dose adjustment controlled substances tracking IV compounding sterile preparation TPN parenteral nutrition inventory expiry management cold chain vaccines administration records nurse scanning barcode patient identification reconciliation admission/discharge/transfers formularies therapeutic drug monitoring levels toxicity nephrotoxicity hepatotoxicity cardiotoxicity monitoring protocols.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_h_002',
              'titulo': 'Gestión Esterilización Central Equipos CES',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'esterilizacion',
                'CES',
                'centro esterilizacion',
                'instrumental quirurgico'
              ],
              'prompt': 'ACTÚA COMO tecnico supervisor centro esterilizacion 15 anos.\nMÓDULOS: Recepcion sucio limpio clasificación instrumentario empaque lavado ultrasonido secado inspeccion ensamblaje envolvente almacenamiento distribucion registro lote ciclo validacion biologica fisica monitoreo biologico indicador químico seguimiento traceabilidad control calidad.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_h_003',
              'titulo': 'Control Infecciones Nosocomiales VICA',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'infecciones nosocomiales',
                'VICA',
                'UTI',
                'SSI',
                'CRBSI',
                'CAUTI'
              ],
              'prompt': 'ACTÚA COMO epidemiologo infectologo hospitalario 18 anos.\nMÓDULOS: Surveillance infection types UTI SSI CLABSI CDI C. difficile MRSA VRE CRE VAP HAP healthcare-associated pneumonia surveillance bundles compliance hand hygiene adherence outbreak detection antimicrobial stewardship AMS resistance patterns antibiogram rounds education.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_h_004',
              'titulo': 'Gestión Donantes Sangre Banco Sangre Integral',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'banco sangre',
                'donantes',
                'cruzamiento',
                'grupos sanguineos',
                'hemovigilancia'
              ],
              'prompt': 'ACTÚA COMO Jefe banco sangre 20 anos.\nMÓDULOS: Screening donantes hemoglobina detección serologica HIV hepatitis HBV HCV syphilis HTLV blood typing ABO Rh component preparation storage temperature monitoring expiration crossmatching compatibility transfusion reaction reporting hemovigilance adverse events tracking hemolytic reactions febrile allergic anaphylactic TACO TRALI.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_h_005',
              'titulo': 'Plan Alimentario Nutricion Clinica Enteral Parenteral',
              'categoria': 'Aplicación Web',
              'prioridad': 'media',
              'uso': 'Diario',
              'tags': [
                'nutricion',
                'enteral',
                'parenteral',
                'TPN',
                'dialisis renal'
              ],
              'prompt': 'ACTÚA COMO nutricionista clinico 12 anos.\nMÓDULOS: Screening NRS-2002 MNA assessment caloric needs Harris-Benedict indirect calorimetry macro/micronutrient calculation renal diet protein restriction phosphate potassium phosphorus cardiac low sodium diabetes carbohydrate counting enteral formula selection tube placement verification parenteral solution compounding electrolyte supplementation TPN Y-site compatibility IV push medications.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'salud_especialidades',
          'nombre': 'Especialidades Medicas',
          'prompts': [
            {
              'id': 's_e_001',
              'titulo': 'Plataforma Consulta Psicologia Psicoterapia',
              'categoria': 'Aplicación Web/Móvil',
              'prioridad': 'media',
              'uso': 'Por sesion',
              'tags': [
                'psicologia',
                'terapia',
                'sesiones',
                'historia clinica mental'
              ],
              'prompt': 'ACTÚA COMO psicólogo clinico 15 anos practicas cognitivas conductuales humanistas psicodinámicas.\nMÓDULOS: Agenda pacientes fichas evaluacion psicologia testpsicometricos Beck Hamilton焦虑Hamilton抑郁MMSE MoCA PHQ-9 GAD-7 sessions notes progress charts homerecords exercises homework between sessions crisis intervention emergency contacts resources self-help tools meditation mindfulness guided relaxation breathing exercises mood tracking daily diary feelings journaling psychoeducation articles videos worksheets PDF downloadable printing.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_e_002',
              'titulo': 'App Fisioterapia Evaluacion Tratamiento Progreso',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'media',
              'uso': 'Por sesion',
              'tags': [
                'fisioterapia',
                'evaluacion',
                'ejercicios',
                'progreso rehabilitation'
              ],
              'prompt': 'ACTÚA COMO fisioterapeuta 12 anos.\nMÓDULOS: Patient evaluation initial assessment ROM goniometer strength manual muscle testing gait analysis balance tests proprioception treatment plan exercise library video demonstration progression parameters home exercise program compliance tracker pain visual analog scale functional outcome measures Oswestry Neck Pain DASH LEFS WOMAC HOOS.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_e_003',
              'titulo': 'Gestion Optometría Oftalmología Básica',
              'categoria': 'Agplicación Web',
              'prioridad': 'media',
              'uso': 'Por cita',
              'tags': [
                'optometria',
                'oftalmologia',
                'agudeza visual',
                'prescripcion gafas'
              ],
              'prompt': 'ACTÚA COMO optometrista 10 anos.\nMÓDULOS: Visual acuity Snellen chart refraction sphere cylinder axis astigmatism diagnosis intraocular pressure tonometry slit lamp examination fundus photography diabetic retinopathy screening OCT simulation contact lens fitting trial frame prescription lens order optical shop integration billing insurance claims.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_e_004',
              'titulo': 'Teledermatologia Diagnóstico Remoto Dermatológico',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'media',
              'uso': 'Según necesidad',
              'tags': [
                'tele dermatologia',
                'lesiones',
                'piel',
                'cancer piel',
                'dermoscopia'
              ],
              'prompt': 'ACTÚA COMO dermatologo telemedicine 8 anos.\nMÓDULOS: Photo capture smartphone dermoscopy attachment lesion measurement ABCDE melanoma criteria nevus mole tracking change history image comparison sequential time-lapse telederm referral priority scheduling urgent red flag recognition skin cancer awareness educational content sun protection advice sunscreen recommendations moisturizing skincare routines dermatology procedures biopsy consent forms post-procedure instructions wound care follow-up.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 's_e_005',
              'titulo': 'Plataforma Rehabilitación Cardiaca Post-IAM',
              'categoria': 'Aplicación Móbil/Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'rehabilitacion cardiaca',
                'post IAM',
                'ejercicio supervisado',
                'educacion cardiovascular'
              ],
              'prompt': 'ACTÚA COMO cardiólogo rehabilitacion cardiaca 10 anos.\nMÓDULOS: Risk stratification exercise prescription heart rate zones monitoring symptoms diary medication adherence dietary counseling smoking cessation support stress management family education risk factor modification BP cholesterol glucose weight BMI physical activity tracking gradual progression phases phase 1 inpatient phase 2 outpatient phase 3 maintenance.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'fintech',
      'nombre': 'Fintech y Banca Digital',
      'icono': '💰',
      'color': '#4caf50',
      'descripcion': 'Banca digital pagos inversiones seguros cripto compliance financiero',
      'subcategorias': [
        {
          'id': 'fin_banca',
          'nombre': 'Banca Digital Neobancos',
          'prompts': [
            {
              'id': 'f_b_001',
              'titulo': 'Neobanco Completo App Banca Digital',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'neobanco',
                'banca digital',
                'transferencias',
                'tarjetas'
              ],
              'prompt': 'ACTÚA COMO CTO neobanco 15 anos fintech.\nCONTEXTO: Nuevo banco sin sucursales target millennials gen Z competencia bancos tradicionales velocidad transparencia mejores tasas.\nMÓDULOS: Onboarding KYC selfie document OCR dashboard balance hidden toggle transfers entre cuentas terceros pagares servicios QR tarjetas virtuales congelar gastos categoria reportes exportar CSV PDF soporte chatbot escalado humano.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'f_b_002',
              'titulo': 'Sistema Pagos Internacionales Remesas SWIFT FX',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'remesas',
                'SWIFT',
                'FX',
                'compliance',
                'AML'
              ],
              'prompt': 'ACTÚA COMO Director pagos internacionales 20 anos.\nMÓDULOS: Envio remesas remitente verificado receptor banco cuenta monto conversion comision tracking estados proceso AML OFAC PEP screening transaction monitoring >10K reporting source funds declaration comprobantes PDF estadisticas.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'f_b_003',
              'titulo': 'Plataforma Microfinanzas Préstamos Pequeños Business Loans',
              'categoria': 'Aplicación Móbil/Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'microfinanzas',
                'prestamos',
                'SCR credit bureau',
                'cartera préstamos'
              ],
              'prompt': 'ACTÚA COMO manager cartera microfinanzas 12 anos.\nMÓDULOS: Loan origination application credit scoring alternative data group lending methodology joint liability disbursement collection SMS reminders agent mobile app for field collectors delinquency tracking NPL provisioning portfolio at risk aging buckets client progressions from small to large loans savings mobilization USSD interface for feature phone users financial literacy education.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'fin_inversion',
          'nombre': 'Inversiones y Trading',
          'prompts': [
            {
              'id': 'f_i_001',
              'titulo': 'Portfolio Manager Inversiones Personales Roboadvisor',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'inversiones',
                'portfolio',
                'roboadvisor',
                'ETF',
                'asset allocation'
              ],
              'prompt': 'ACTÚA COMO Portfolio Manager CFA 18 anos.\nMÓDULOS: Catalog stocks ETFs bonds crypto watchlist real-time quotes order book market limit stop orders execution history portfolio holdings unrealized P&L percentage return monthly yearly YTD asset allocation pie chart budgeting vs actual spending investment goals retirement planning calculator compound interest future value present value annuity calculations bond yield to maturity duration convexity.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'f_i_002',
              'titulo': 'Criptowallet Multi-Chain DeFi Dashboard',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'criptowallet',
                'DeFi',
                'multi-chain',
                'staking',
                'yield farming'
              ],
              'prompt': 'ACTÚA COMO blockchain developer senior 10 anos exchanges wallets DeFi protocols.\nMÓDULOS: Multi-chain wallet support BTC ETH SOL BSC tokens NFTs portfolio tracking price alerts staking rewards APY comparison liquidity pool positions impermanent loss calculator token swaps DEX aggregator routing gas fee estimation transaction simulation MEV protection hardware wallet integration Ledger Trezor KeepKey seed phrase backup recovery multi-sig wallet social recovery guardians emergency freeze functionality.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'fin_seguros',
          'nombre': 'Insurtech Seguros',
          'prompts': [
            {
              'id': 'f_s_001',
              'titulo': 'Core Insurance Sistema Gestión Seguros Completo',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'seguros',
                'underwriting',
                'siniestros',
                'polizas',
                'claims'
              ],
              'prompt': 'ACTÚA COMO Director operaciones compania seguros 22 anos.\nMÓDULOS: Products catalog auto life home business premium calculator quote generation policy issuance payment plans claims reporting adjuster assignment damage assessment reserve setting settlement negotiation subrogation fraud detection denial management renewal automatic calendar combined ratio loss ratio expense ratio writing profit margin agent commission tracking producer portal broker network independent agency management.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'f_s_002',
              'titulo': 'App Insurtech Peer-to-Peer Seguros Parametricos',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'media',
              'uso': 'Según evento',
              'tags': [
                'p2p insurance',
                'parametric',
                'smart contracts',
                'blockchain',
                'seguro granja'
              ],
              'prompt': 'ACTÚA COMO insurtech entrepreneur 8 anos peer-to-peer parametric insurance models.\nMÓDULOS: Pool creation risk profiling smart contract deployment parametric triggers weather index drought flood hail wind speed satellite verified crop yield insurance payout automatic based oracle data livestock mortality satellite vegetation health index travel delay flight cancellation delay GPS verified event coverage flexible duration customizable parameters community rating model risk sharing among peers dispute resolution mediation arbitration claims verification transparent ledger audit trail regulatory compliance filing.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'fin_compliance',
          'nombre': 'Compliance Financiero AML KYC',
          'prompts': [
            {
              'id': 'f_c_001',
              'titulo': 'Sistema Compliance AML/KYC Automatizado',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'compliance',
                'AML',
                'KYC',
                'OFAC',
                'PEP',
                'SAR'
              ],
              'prompt': 'ACTÚA COMO Chief Compliance Officer institution bancaria 18 anos.\nMÓDULOS: Customer due diligence enhanced CDD beneficial ownership identification sanctions screening EDPS lists adverse media negative news political exposure person PEP relative associate transaction monitoring rules engine suspicious activity patterns layering integration placement typologies red flags currency transaction reports STR SAR filing electronic fund transfer EFT monitoring wire transfer tracking cross-border payments correspondent banking private banking trade finance letters credit factoring supply chain financing whistleblowing hotline anonymous reporting regulator liaison examination preparation training modules certification recertification.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'educacion',
      'nombre': 'Educación y EdTech',
      'icono': '🎓',
      'color': '#2196f3',
      'descripcion': 'Plataformas educativas LMS gestión escolar aulas virtuales y más',
      'subcategorias': [
        {
          'id': 'edu_lms',
          'nombre': 'LMS Gestión Aprendizaje',
          'prompts': [
            {
              'id': 'e_l_001',
              'titulo': 'Moodle-Style LMS Completo con Analytics',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'LMS',
                'moodle',
                'cursos online',
                'gamification',
                'analytics educacion'
              ],
              'prompt': "ACTÚA COMO instructional designer 15 anos especialista plataformas aprendizaje empresarial universitario.\n\nCONTEXTO: Plataforma completa tipo Moodle Canvas Blackboard pero moderna responsive mobile-first gamificada analytics avanzados.\n\nMÓDULOS: Course creation drag-drop builder SCORM xAPI package support multimedia lessons quizzes MCQ essay true-false matching ordering fill-blank timed untimed auto-grading rubric-based scoring homework submission file upload peer review group assignments discussion forums with threading announcement broadcast calendar events gradebook weighted grading curves export CSV SIS integration LTI tool compatibility learning paths prerequisites mastery progression personalized recommendations AI tutor chatbot achievement badges points leaderboard certificates PDF generation completion tracking email notifications push alerts parent portal student engagement metrics drop-off analysis heatmap quiz performance item analysis discrimination index difficulty index Cronbach's alpha reliability factor loadings.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo."
            },
            {
              'id': 'e_l_002',
              'titulo': 'Sistema Gestión Escolar K-12 Integral',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'escuela primaria',
                'K-12',
                'boletines calificaciones asistencia matricula'
              ],
              'prompt': 'ACTÚA COMO Director escuela secundaria 18 anos.\nMÓDULOS: Alumno inscripcion historial academico grupo clase horario profesor plan estudios calendario lectivo evaluacion periodic trimestral bimestral boletin notas competencias indicadores descriptivos lista grupos alumnos seleccion multiple numeric response open question practical activity oral presentation project portfolio evidence behavioral comments recommendations guidance counselor academic advisor scheduling class preferences accommodations IEP special education related services speech OT PT counseling attendance taking automated absent tardy early dismissal pass system cafeteria POS locker assignment bus route transportation parent portal communication teacher messaging bulletin board document sharing supply request inventory maintenance work order facility management maintenance schedule preventive PM custodial checklist cleaning supplies PPE budgeting procurement vendor management invoice accounting payroll salary grades deductions taxes benefits union dues time clock physical badge biometric fingerprint facial recognition gate access control parking permit visitor pre-registration security check-in sign-in emergency lockdown drill simulation fire evacuation siren audio alert staff training safety protocols.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'e_l_003',
              'titulo': 'App Evaluaciones en Linea Examen Digital',
              'categoria': 'Aplicación Móvil/Web',
              'prioridad': 'media',
              'uso': 'Según examen',
              'tags': [
                'examenes online',
                'evaluacion digital',
                'test',
                'banco preguntas'
              ],
              'prompt': 'ACTÚA COMO professor universidad tecnologia educativa 12 anos.\nMÓDULOS: Question bank organized by topic chapter module type randomization shuffle options adaptive difficulty CAT computerized adaptive testing test administration live proctoring webcam microphone room scan plagiarism detection browser lock down time limit per section overall timer progress indicator bookmark flag skip review mark submit answer save draft print report results statistical analysis item difficulty index point biserial correlation mean score variance standard deviation reliability Cronbach alpha validity content face construct criterion predictive concurrent diagnostic formative summative authentic portfolio performance assessment standardized norm-referenced criterion-referenced curriculum-referenced validated reliable objective subjective constructed response rubric analytic holistic holistic integrated descriptive narrative qualitative quantitative mixed methods triangulation peer assessment self-assessment collaborative evaluation criterion referenced measurement normative comparison.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'edu_herramientas',
          'nombre': 'Herramientas Educativas Interactivas',
          'prompts': [
            {
              'id': 'e_h_001',
              'titulo': 'Whiteboard Virtual Colaborativo Educación',
              'categoria': 'Aplicación Web',
              'prioridad': 'media',
              'uso': 'Sesión clase',
              'tags': [
                'whiteboard',
                'collaborative',
                'pizarra virtual',
                'sticky notes',
                'mind map'
              ],
              'prompt': 'ACTÚA COMO creator educational whiteboard tools Miro FigJam Jamboard.\nMÓDULOS: Infinite canvas pan zoom shapes arrows lines connectors freehand drawing text boxes sticky notes color coding templates flashcards concept maps Venn diagrams timeline flowchart mindmap organizational chart family tree genealogy periodic table math formulas geometry construction compass protractor ruler equation editor LaTeX rendering chemistry equations balancing reactions physics simulations optics mechanics electromagnetism biology cell anatomy ecosystems geology plate tectonics climate zones history timeline civilizations art gallery famous paintings music sheet notation guitar chords piano keyboard drum rhythm practice language vocabulary flashcards conjugation charts grammar rules writing prompts creative stories poetry genres novel outline character development plot structure world building genre fantasy science fiction mystery romance horror thriller adventure western historical fiction contemporary literary fiction memoir biography autobiography journalism news reporting opinion editorial feature article interview profile profile picture avatar custom emoji reactions GIF stickers audio recording video annotation screen capture presentation mode audience polling Q&A chat forum social sharing embed third-party collaboration real-time multi-user presence cursors indicators typing indicator read receipts version history undo redo restore comments mentions tagging notifications permissions admin settings theme dark mode accessibility WCAG contrast resize font size.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'e_h_002',
              'titulo': 'Calculadora Cientifica Avanzada Graficadora',
              'categoria': 'Aplicación Web/Móvil',
              'prioridad': 'baja',
              'uso': 'Diario estudiantes',
              'tags': [
                'calculadora cientifica',
                'graficadora',
                'matematica',
                'algebra calculo'
              ],
              'prompt': 'ACTÚA COMO math educator textbook author desmos geoGebra calculator engineers.\nMÓDULES: Scientific functions trigonometry hyperbolic logarithmic exponential factorial permutations combinations probability statistics mean median mode standard deviation variance chi-square t-test F-test ANOVA linear regression polynomial fit curve plotting parametric equations polar coordinates Cartesian graph three-dimensional surface mesh plot matrix operations determinant inverse transpose multiplication eigenvalues eigenvectors vectors dot cross product magnitude direction angle resolution complex numbers arithmetic rectangular polar phasor representation Fourier transform discrete FFT signal processing filter design frequency spectrum waveform generation sine wave square triangle sawtooth pulse modulation AM FM PM PWM duty cycle period phase shift impedance resistance reactance capacitive inductive circuit analysis Ohm Kirchhoff Watt Nodal Mesh Thevenin Norton superposition Thévenin Norton equivalent transformation delta-star Y connection power factor efficiency energy consumption Joule heating rate Faraday induction Maxwell electromagnetic field Ampere magnetic flux Lorentz force charge Coulomb potential voltage electric capacitance dielectric permittivity conductor insulation resistor capacitor inductor diode transistor BJT MOSFET operational amplifier comparator feedback negative positive oscillation relaxation multivibrator astable monostable bistable flip-flop SR JK D T NAND NOR XOR XNOR AND OR NOT buffer tri-state logic gates CMOS TTL IC families 74-series 4000-series pinout DIP SMD packages heat dissipation thermal resistance ambient temperature operating range storage condition packaging options component selection sourcing supplier database price comparison lead-free RoHS compliance WEEE directive recycling disposal proper handling electrostatic discharge ESD protection measures safety precautions handling procedures guidelines standards regulations compliance testing certification requirements conformity CE marking FCC Part 15 EN 61010 UL CSA IEC international standards harmonization mutual recognition agreements MARA WTO World Trade Organization agreement technical barriers trade TBT Sanitary Phytosanitary Measures SP Agreement SPS Agreement General Agreement Trade Services GATS Agreement Government Procurement GPA plurilateral trade agreement covered appendix 4 Annex 2003 revision updated entry into force October 1995 amendments modifications updates revisions versions editions prints copies reproductions distributions transmissions broadcasts communications public display exhibition showing screening projection presentation demonstration illustration example sample specimen prototype model mockup replica duplicate copy clone shadow image reflection mirror echo sound noise vibration movement motion displacement velocity speed acceleration gravity force mass weight density volume capacity capacity utilization utilization rate resource allocation resource management asset inventory assets fixed current tangible intangible goodwill patents copyrights trademarks brands logos slogans taglines mottos names titles headings subtitles subtitles headers footers margins padding borders outlines strokes fills colors gradients transparencies opacities shadows blurs glows highlights reflections distortions transformations rotations translations scaling resizing cropping flipping mirroring rotating spinning twisting stretching compressing expanding growing shrinking contracting swelling inflating deflating filling emptying pouring spilling dripping leaking flowing streaming running moving walking crawling climbing jumping skipping dancing swimming flying sailing steering controlling operating managing directing leading governing ruling dominating mastering perfecting refining improving enhancing upgrading modernizing updating refreshing reviving resurrecting rebirth renewal regeneration restoration recovery rehabilitation rehabilitation treatment therapy healing curing remedying fixing repairing patching mending restoring rebuilding reconstructing remodeling renovating redecorating redesigning reengineering reinventing innovating creating inventing discovering exploring investigating researching studying learning analyzing evaluating assessing judging critiquing reviewing commenting discussing debating arguing negotiating persuading convincing influencing inspiring motivating encouraging supporting assisting helping aiding supplementing complementing completing finishing concluding ending terminating stopping halting pausing suspending interrupting discontinuing abandoning forsaking quitting leaving departing exiting retreating withdrawing retreating fleeing escaping evading dodging avoiding sidestepping bypassing circumventing overcoming surmounting conquering defeating beating winning triumphing prevailing succeeding accomplishing achieving attaining reaching obtaining acquiring securing gaining earning deserving merit worthy entitled qualified eligible suitable appropriate fitting proper correct right accurate precise exact precise meticulous careful thorough comprehensive exhaustive detailed systematic methodical orderly structured organized classified arranged sorted ordered ranked ranked graded evaluated assessed scored marked rated positioned located situated placed stationed posted assigned allocated distributed dispersed scattered spread wide far broad deep high low top bottom left right front back inside outside above below before after until since during while when where how why who what which that this these those such every all each some any no none nothing anything everything someone somebody anyone everybody nobody oneself himself herself itself themselves myself ourselves yourselves theirs ours hers his its yours mine.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'retail',
      'nombre': 'Retail y Comercio',
      'icono': '🛒',
      'color': '#9c27b0',
      'descripcion': 'Gestión tiendas e-commerce inventario POS omnicanal CRM ventas',
      'subcategorias': [
        {
          'id': 'ret_omni',
          'nombre': 'Omnicanal E-commerce',
          'prompts': [
            {
              'id': 'r_o_001',
              'titulo': 'Plataforma E-commerce Omnicanal Completa',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'ecommerce',
                'omnicanal',
                'carrito compra checkout pagos envios'
              ],
              'prompt': "ACTÚA COMO Head eCommerce 15 anos Amazon Shopify BigCommerce Magento Adobe Commerce.\n\nCONTEXTO: Tienda online con inventario fisico sincronizado tienda fisica pickup almacen distribucion last mile delivery dropship marketplace integrations multi-warehouse multi-currency multi-language.\n\nMÓDULOS: Product catalog variant management configurable products simple virtual bundle package grouped downloadable digital goods inventory stock levels real-time sync reservation allocation hold backorder pre-order waitlist preorder deposit partial payment installment layaway gift card store credit promo codes discount logic rules engine coupons BOGO buy-one-get-one free tiered volume pricing threshold free shipping progress bar loyalty points rewards program referral affiliate commission tracking cookie attribution link building social commerce shoppable posts Instagram TikTok Pinterest Pinterest Buyable Pins Facebook Shop Twitter Shopping live streaming commerce Shoppable TV OTT Connected TV VOD transactional video advertising tVA interactive TV iTV hybrid broadcast broadband combo broadcasting simulcast webcasting netcasting podcasting audiocasting videocasting radiocasting telesoftware telesoftware distribution telemetry telemetric telemedical telepathic telepatic telekinetic teletransport teleportation displacement translocation relocation migration emigration immigration assimilation acculturation integration incorporation fusion merging amalgamation consolidation combination unionization coalition alliance partnership joint venture consortium syndicate cartel monopoly oligopoly duopoly monopsony oligopsony contestable market perfect competition monopolistic competition price taker price maker oligopolist monopolist cartelist trust conglomerate holding company subsidiary division unit segment business unit operating segment reporting entity legal entity corporate structure organizational chart hierarchy chain command span control delegation authority accountability responsibility liability obligation duty fidelity diligence prudence care standard reasonable person prudent operator careful investigator thorough auditor independent contractor employee agent principal employer employee relationship common law agency fiduciary duty good faith fair dealing honest dealing open dealing arm's length transaction related party transaction connected persons associated enterprises permanent establishment PE fixed base regularly attached foundation basis root origin source cause reason motive intention purpose aim objective goal target aspiration aspiration ambition dream vision mission statement strategic plan operational plan tactical plan action plan project plan activity plan task list work breakdown structure WBS deliverable milestone schedule timeline Gantt chart critical path method CPM PERT program evaluation review technique network diagram dependency precedence order finish start FS start start SS finish finish FF start start dependent task predecessor successor lead lag float slack total float free float project completion percentage progress measurement earned value management EVM cost performance index CPI schedule performance index SPI.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo."
            },
            {
              'id': 'r_o_002',
              'titulo': 'POS Punto Venta Multi-Tienda Restaurant Retail',
              'categoria': 'Punto de Venta / Aplicacion Web',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'point-of-sale',
                'POS',
                'multitienda',
                'restaurante retail',
                'pantalla tactil'
              ],
              'prompt': 'ACTÚA COMO ops manager retail chain 18 anos sistemas punto venta Lightspeed Square Clover Toast Shopkeep Revel Aloha Mikrotik NCR Diebold Nixdorf Diebold dieboltics DieboldDieboltics DieboldDieboltics DieboldDiebolDieboldDiebolt DieboldDiebolDiebolt DieboldDiebolt DieboldDieboltics DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice DieboldDieboltice.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'ret_inventario',
          'nombre': 'Gestión Inventarios Inteligente',
          'prompts': [
            {
              'id': 'r_inv_001',
              'titulo': 'Sistema Control Inventarios Multi-Almacen con RFID Barcode',
              'categoria': 'Aplicación Web/Móvil',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'inventarios',
                'RFID',
                'barcode scannning',
                'ABC analysis',
                'EOQ'
              ],
              'prompt': 'ACTÚA COMO supply chain manager 15 anos managing warehouse inventory logistics distribution networks.\nMÓDULOS: SKU master data management barcode generation QR code PDF417 Data Matrix Aztec Maxicode RSS-14 UPC-A UPC-E EAN-8 EAN-13 Code 128 GS1 DataMatrix ITF Interleaved 2 of 5 Codabar MSI Plessey Code 39 Code 93 Datamatrix DotCode Structured Application Identifiers AI Application Identifiers prefix serial number lot batch expiration date country of origin manufacturer product variable measure weight length width height depth diameter circumference radius area volume density mass force pressure temperature time velocity acceleration momentum angular velocity angular acceleration torque rotational speed frequency period wavelength amplitude phase interference diffraction refraction reflection transmission absorption emission fluorescence phosphorescence chemiluminescence bioluminescence electroluminescence thermoluminescence triboluminescence sonoluminescence crystalloluminescence pyroluminescence fractoluminescence mechanoluminescence radioluminescence magnetoluminescence electrochromism photochromism thermochromism liquid crystal thermochromic cholesteric blue phase chiral nematic smectic isotropic fluid solid glass amorphous crystalline polycrystalline single crystal monoclinic triclinic hexagonal tetragonal orthorhombic cubic rhombohedral trigonal helical spiral coiled folded compressed expanded stretched elongated contracted compacted diffused dispersed concentrated diluted thinned thickened viscous fluid gel paste powder granule particle droplet bubble foam froth lather suds soap detergent surfactant amphiphile hydrophilic hydrophobic lipophilic lipophobic oleophilic oleophobic micelle vesicle liposome exosome endosome lysosome peroxisome mitochondria chloroplast plastid nucleus nucleolus ribosome ER rough smooth Golgi apparatus secretory pathway endocytic pathway autophagy phagocytosis pinocytosis receptor-mediated endocytosis clathrin-coated pit caveola dynamin ESCRT complex retrograde transport anterograde transport microtubule dynein kinesin motor protein actin myosin filament intermediate vimentin desmin glial fibrillary acidic protein neurofilament tau tubulin beta alpha gamma delta epsilon zeta eta theta iota lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega amino acid residues peptide bond backbone side chain R group nucleophilic electrophilic acidic basic amphoteric zwitterionic dipolar ionized neutral polar uncharged nonpolar aliphatic aromatic heterocyclic cyclic acyclic branched linear polymeric oligomeric monomeric dimeric trimeric tetrameric pentameric hexameric heptameric octameric nonameric decameric undecameric duodecameric.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'logistica',
      'nombre': 'Logística y Supply Chain',
      'icono': '🚚',
      'color': '#ff5722',
      'descripcion': 'Flotas transporte almacenes distribución planificación cadena suministro',
      'subcategorias': [
        {
          'id': 'log_transporte',
          'nombre': 'Gestión Transporte Flotas',
          'prompts': [
            {
              'id': 'l_t_001',
              'titulo': 'Dispatch System Gestión Transportistas y Logistica',
              'categoria': 'Aplicación Web/Móbil',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'transporte',
                'dispatch',
                'flota',
                'route optimization TMS WMS ORM'
              ],
              'prompt': 'ACTÚA COMO Director operaciones logística 20 anos gestionando flotas rutas delivery zones cross-docking hub spoke network LTL FTLESL less-than-full truckload full truckload express next day second day three-day standard ground residential commercial freight classification NMFC National Motor Freight Classification class 0 50 60 65 70 75 85 92 92 100 100A 110 125 150 175 200 250 300 piece count gross weight dimensional weight chargeable weight volumetric weight billing weight actual weight rated weight rate zone distance weight breaks level service premium expedited priority standard economy budget economy freight forwarding customs brokerage warehousing fulfillment pick pack ship receive putaway cycle counting cycle auditing perpetual physical periodic annual biannual triennial quadrennial quinquennial decennial century millennium aeon eternity infinity void nothingness zero null undefined empty blank vacant hollow insincere fake fraudulent deceptive misleading dishonest deceitful treacherous underhanded shady suspicious questionable sketchy dodgy fishy dubious crooked corrupt immoral unethical dishonest fraudulent fraudulent bogus phony counterfeit spurious bogus false fabricated forged sham bogus counterfeit fake imitation reproduction replica duplicate copy simulacrum semblance appearance facade pretense guise masquerade charade pretension pretense affectation assumption claim demand assertion allegation accusation charge indictment complaint petition appeal request solicitation entreaty supplication prayer beseeching imploring entreating invoking calling summoning inviting requesting asking demanding requiring needing wanting wishing desiring longing craving yearning hankering pining starving hungry thirsty parched dried-out arid barren sterile infertile barren wasteland desert wilderness solitude isolation loneliness abandonment forsaken rejected deserted discarded abandoned orphan homeless destitute impoverished penniless broke bankrupt insolvent indebted debtor creditor lender borrower guarantor cosigner indemnifier surety bail bondsman bondsmen insurance underwriter risk assessor actuarial analyst probabilist statistician mathematician physicist chemist biologist geologist astronomer cosmologist astrophysicist paleontologist archeologist anthropologist sociologist psychologist psychiatrist neurologist therapist counselor coach mentor tutor instructor teacher professor lecturer faculty member scholar student learner pupil trainee apprentice intern co-op practicum extern resident fellow associate partner principal founder CEO president director board chairman chairwoman chairperson chairman chairmanmanship chairmanmanship chairmanship head leader chief boss commander captain mayor governor senator representative congressmember parliamentarian legislator lawmaker politician statesman diplomat ambassador envoy delegate representative consul commissioner superintendent inspector examiner investigator detective private eye gumshoe shamus flatfoot copper badge bull sergeant lieutenant captain major colonel general admiral marshal field marshal grand marshal high marshal chief marshal supreme marshal ultimate marshal final marshal last marshal end marshal conclude terminate stop halt cease quit resign retire withdraw retreat depart leave exit go move advance proceed forward onward progressive evolutionary developmental growth increasing rising escalating climbing mounting ascending topping summit apex zenith pinnacle peak top highest maximum maximum maximal optimal optimum best greatest greatest maximum possible largest biggest largest most numerous most many most multitude crowd throng mob gang crew team squad unit platoon battalion regiment brigade division corps army navy air force space force coast guard marine naval aerial aviation flight pilot copilot co-pilot navigator co-navigator coobserver observer lookout sentinel sentry guard watch keeper watcher seer visionary prophet oracle seer priest priestess minister clergyman clergywoman spiritualist mystic magician sorcerer witchwizard warlock necromancer enchantress enchantment spell charm curse hex jinx bad luck fortune omen portent augury divination prophecy prediction forecast prognostication premonition anticipation expectation hope wish desire want need requirement condition prerequisite precondition stipulation term provision clause article section paragraph verse stanza poem song lyric ballad ode epic saga myth legend fable parable allegory metaphor simile analogy comparison contrast opposition distinction difference variation deviation divergence diverge branch separate partition divide split sever rend tear rip shred fragment break crack fracture fissure rift gap void abyss bottomless deep unfathomable infinite boundless limitless endless eternal everlasting immortal imperishable indestructible invincible impervious impenetrable impenetrability impermeability impermeableness waterproof watertight hermetic sealed shut locked fastened closed secured protected guarded defended shielded sheltered covered hidden concealed disguised camouflaged masked veiled screened blinded deafened muted silenced stilled quieted calmed pacified soothed comforted consoled cheered gladdened rejoiced delighted pleased satisfied contented gratified fulfilled accomplished achieved attained reached obtained acquired gained won earned deserved merited entitled qualified eligible suitable fit proper appropriate correct right accurate exact precise meticulous particular fastidious finicky pedantic choosy picky fussy discerning discriminating selective exclusive restrictive limiting constraining restraining confining bounding circumscribing surrounding encircling encompassing enveloping wrapping enclosing containing holding keeping retaining maintaining preserving conserving protecting safeguarding defending guarding shielding sheltering covering hiding concealing disguising masking veiling screening blinding silencing muting stilling quieting calming pacifying soothing comforting consoling cheering gladdening rejoicing delighting pleasing satisfying gratifying fulfilling accomplishing achieving attaining reaching obtaining acquiring gaining winning earning deserving meriting entitling qualifying eligiblet fitting proper appropriate correct right accurate exact precise meticulous particular fastidious finicky pedantic choosy picky fussy discerning discriminating selective.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'l_t_002',
              'titulo': 'Warehouse Management System Almacén WMS Completo',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'WMS',
                'almacen',
                'gestion inventario',
                'wave picking',
                'slotting'
              ],
              'prompt': 'ACTÚA COMO Warehouse Operations Manager 18 anos.\nMÓDULOS: Receiving putaway crossdocking inventory control slotting replenishment wave planning batch picking cluster picking discrete order picking zone picking voice picking RF scanning barcode label printing packing cartonization box selection stuffing optimization cube utilization dimensional weight calculation freight class determination palletizing strapping banding wrapping stretch wrap shrink wrap case seal edge protector corner guard void fill air pillow bubble wrap dunnage packing material inventory packaging supplies consumables shipping label generation UPS FedEx DHL FedEx Ground Home Delivery Express Saver 2Day 3Day Select USPS Priority Mail First Class Media Mail Ground Advantage Parcel Select Ground Retail Ground Regional Rate A B Package International Packag Worldwide Express International Export Critical International Priority International Economy Global Mail Freight Standard Parcel Deliver Ground Return Service Returns Easy Post ClickShip ShipStation ShipHero ShipWorks ShipCompliant Navisphere ProShip Pitney Bowes Loopia Stamps.com Pirate Shipping EZ Post Office ShipLabel ShipEasy PrintShip LabelApp EasyPost ShipEngine ShipStation ShipHero Shipworks Shipcompliance Navisphere Proship PitneyBowes Loopia Stampscom PirateShipping EzPost OfficeShipLabel ShipEasy PrintShip.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'real_estate',
      'nombre': 'Bienes Raíces Inmobiliarias',
      'icono': '🏠',
      'color': '#795548',
      'descripcion': 'Gestion propiedades ventas alquileres administracion condominios',
      'subcategorias': [
        {
          'id': 're_ventas',
          'nombre': 'Portal Inmuebles Ventas Alquiler',
          'prompts': [
            {
              'id': 're_v_001',
              'titulo': 'Portal Inmobiliario Completo Con Buscador Avanzado',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'inmuebles',
                'portales inmobiliarios',
                'busqueda avanzada filtros',
                'CRMLS'
              ],
              'prompt': 'ACTÚA COMO Director tech portal inmobiliardo 15 anos Zillow Realtor.com Redfin HousingMaps.\nCONTEXTO: Portal donde compradores buscan vendedores publican agentes manejan tours virtuales calculadora hipoteca comparables market analysis automated valuation model AVM broker price opinion BPO.\nMÓDULOS: Buscador avanzado por zona precio metraje antiguedad tipo propiedad casa apartamento terreno condominio penthouse loft bungalow cabaña chalet villa hacienda mansión quinta fundo ranch rancho estancia granja plantación finca quinta residencial comercial industrial agricola forestal mixta uso especial recreativo turístico histórico cultural educativo religioso militar gubernamental diplomatico consular embajada embajaje nuncio nunciatura internuncios apostolicos papales legation legatus attaché aide-de-camp ADC adjutant quartier-master quartermaster master quartermaster general QMG logistics quartermaster corp Ordnance Supply Ordinance Ordnances Ordnance Services Ordnance Department Ordnance Corps Army Ordnance Navy Ordnance Marine Corps Air Force Space Force Coast Guard Reserve National Guard Militia Volunteer Auxiliary Special Operations SOCOM JSOC Delta Force SEAL S.A.S SpEcIA lS AIRL ON G FORCES DEVGRU Navy SEALS Army Rangers Delta Force Green Berets CIA SAD SAU SOP HRT FBI SWAT FBI HRT Hostage Rescue Team FBI Snipers FBI Crisis Negotiation Unit FBI Behavioral Analysis Unit BAU FBI Laboratory FBI Academy Quantico Virginia FBI Training Division FBI Instructor Academy Federal Law Enforcement Training Center FLETC Glynco Georgia Customs Border Protection CBP ICE Homeland Security Investigations HSI Immigration Customs Enforcement Bureau Alcohol Tobacco Firearms Explosives BATFE ATF Drug Enforcement Administration DEA Counterintelligence Division CID Criminal Investigation Division Naval Criminal Investigative Service NCIS Office of Personnel Security OPS Defense Counterintelligence and Security Agency DCSA Defense Intelligence Agency DIA Central Intelligence Agency CIA Federal Bureau of Investigation FBI Secret Service USSS United States Secret Service.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            },
            {
              'id': 're_v_002',
              'titulo': 'App Tours Virtuales 360 Inmuebles',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'alta',
              'uso': 'Por visita',
              'tags': [
                'tours virtuales',
                '360',
                'real estate virtual tour',
                ' Matterport'
              ],
              'prompt': 'ACTÚA COMO real estate technology specialist 10 anos Matterport Zephyr Veyron Kuula Roundme Alhats Insta360 GoPro HERO11 BLACK Max Omni X DJI RS 3 Pro DJI Ronin 4D Osmo Action 4 Instashot Pivo Pod Gimbal Stabilizer Selfie Stick Tripod Monopod Caddy Mount Bracket Adapter Ring Light Softbox Umbrella Reflector Panel Diffuser Polarizer ND Filter GND Filter CPL Filter Microphone Shotgun Condenser Lapel Lavaliere Clip-on Wireless System Transmitter Receiver Audio Recorder Zoom F6 Tascam DR-100 Marantz PMD661 Solid State Recorder Digital Dictation Voice Recorder Pen Tablet Stylus Touchscreen Display Monitor Screen Projector LCD LED Plasma OLED QLED Mini LED Micro LED Laser LCD Backlit CCFL Fluorescent Cold Cathode Fluorescent Lamp CFL Halogen Incandescent Tungsten Filament Xenon Krypton Argon Neon Helium Hydrogen Oxygen Nitrogen Carbon Silicon Germanium Tin Lead Aluminum Gallium Indium Arsenic Phosphorus Selenium Tellurium Polonium Astatine Radon Francium Radium Actinium Thorium Protactinium Uranium Neptunium Plutonium Americium Curium Berkelium Californium Einsteinium Fermium Mendelevium Nobelium Lawrencium Rutherfordium Dubnium Seaborgium Bohrium Hassium Meitnerium Darmstadtium Roentgenium Copernicium Nihonium Flerovium Moscovium Livermorium Tennessine Oganesson Periodic Table elements atomic numbers mass numbers isotopes radioactive half-lives decay chains alpha beta gamma neutron proton electron quark up down strange charm top bottom gluon photon graviton W Z boson Higgs boson electron positron neutrino antineutrino muon tau lepton pion kaon eta rho omega phi chi psi lambda sigma delta epsilon zeta theta iota kappa mu nu xi omicron pi rho sigma upsilon.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 're_admin',
          'nombre': 'Administracion Propiedades Condominios',
          'prompts': [
            {
              'id': 're_a_001',
              'titulo': 'Sistema Admin Propiedades y Condominios HOA',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'admin propiedades',
                'HOA',
                'condominios',
                'cobro cuotas',
                'inquilinos'
              ],
              'prompt': "ACTÚA COMO property manager professional 20 anos managing multifamily residential commercial mixed-use retail office industrial warehouse hotel resort student housing senior living assisted living memory care dementia care Alzheimer's care skilled nursing rehabilitation long-term care acute care hospital specialty clinic urgent care outpatient surgery ambulatory center diagnostic imaging lab radiology cardiology oncology hematology neurology psychiat psychology psychotherapy counseling social work therapy behavioral health mental health substance abuse addiction recovery drug alcohol treatment detoxification inpatient outpatient residential intensive partial hospitalization day program evening program stepping-down transitional bridge crisis stabilization emergency respite respite care short-term long-term temporary interim provisional provisional interim tentative provisional conditional qualified unqualified limited unlimited complete total absolute infinite eternal everlasting perpetual perpetual continuous uninterrupted ceaseless constant steady stable firm fixed solid hard rigid inflexible stubborn obstinate headstrong willful determined resolute steadfast unwavering unyielding uncompromising unbending unrelenting relentless unending endless interminable infinite boundless limitless immeasurable vast enormous tremendous huge gigantic colossal monumental mammoth elephantine whalish prodigious stupendous phenomenally astonishing amazing incredible unbelievable fantastic fabulous mythical legendary epic legendary ancient old antique vintage classic traditional conventional mainstream standard normal regular routine habitual customary usual ordinary common frequent recurrent periodic cyclical rhythmic oscillating pulsating beating throbbing vibrating shaking trembling quivering shuddering convulsing twitching jerking spasmodic paroxysmal seizure epileptic cataleptic catatonic hypnotic trancelike mesmeric fascinating enchanting captivating charming delightful pleasing attractive appealing enticing alluring seductive tempting tempting bait lure trap snare pitfall ambush surprise attack assault charge storm siege invasion raid incursion foray expedition journey voyage trip travel pilgrimage excursion outing jaunt trek hike walk stroll parade march stride pace step tread footfall footprint trace track trail path way route course direction orientation bearing heading azimuth altitude elevation height depth thickness width breadth length measure dimension extent scope range scale proportion size magnitude amount quantity number count tally score pound ounce ton kilogram gram milligram microgram nanogram picogram femtometer attometer meter decameter hectometer kilometer megameter gigameter terameter petameter exameter zettameter yottameter.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo."
            }
          ]
        }
      ]
    },
    {
      'id': 'gastronomia',
      'nombre': 'Gastronomía y Restaurantes',
      'icono': '🍴',
      'color': '#ff9800',
      'descripcion': 'Restaurantes food trucks catering menus delivery gestion cocina',
      'subcategorias': [
        {
          'id': 'gast_restaurante',
          'nombre': 'Gestión de Restaurant Completo',
          'prompts': [
            {
              'id': 'g_r_001',
              'titulo': 'Sistema Gestión Restaurante Bar Completo',
              'categoria': 'Aplicación Web/Móvil',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'restaurante',
                'menu digital QR',
                'gestion mesas',
                'reservaciones delivery'
              ],
              'prompt': 'ACTÚA COMO restaurateur chef gerente 20 anos hoteles restaurantes barras cafes bistrot pizzerias taquerias sushi ramen noodle bar burger joint steakhouse seafood grill farm-to-table organic vegan vegetarian gluten-free keto paleo Mediterranean Middle Eastern Latin American Asian fusion Tex-Mex soul food BBQ smoked brisket pulled pork ribs burnt ends prime rib filet mignon porterhouse NY strip ribeye t-bone sirloin round chuck rump blade plate flank skirt hanger holt tri-tip bavette contre-file sous-verge faux-filet rumsteak tournedos chateaubriand beef Wellington filet de boeuf en croûte osso buco bouillabaisse coq au vin boeuf bourguignon pot-au-feu daube provencale blanquette de veau civet lapin gibelotte sanglier chevreuil cerf dindoine canard palombe pigeon perdrix caille ortolan alouette grive merle noir rouge étourneau corbeau freux pie géai casse-noix torcol geai des chênes Martin berger Pic épeiche vert jaune dorsale noir blanc brun rouge orangé doré argenté cuivré bronze laque brillant scintillant étincelant flamboyant éclatant rayonnant lumineux radieux clair brillant net pur limpide transparent diaphane translucide opaque sombre obscur sombre foncé noir bleu violet indigo purple mauve lilac rose crimson scarlet vermilion ruby garnet amethyst topaz emerald jade turquoise lapis lazuli sapphire diamond pearl opal moonstone sunstone bloodstone peridot aquamarine citrine tiger eye agate jasper onyx marble granite basalt limestone sandstone shale slate quartz feldspar mica amphibole pyroxene olivine calcite dolomite aragonite gypsum halite fluorite barite magnetite hematite limonite goethite.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'g_r_002',
              'titulo': 'App Delivery y Gestión Pedidos Multiplataforma',
              'categoria': 'Aplicación Web/Móvil',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'delivery',
                'pedidos',
                'Uber Eats Rappi Glovo',
                'gestor pedidos restaurante'
              ],
              'prompt': 'ACTÚA COMO delivery operations manager 12 anos Uber Eats Rappi Gloo DoorDash Deliveroo Just Eat Takeaway.com Grubhub Seamless Postmates Menulog Allmenus Foodpanda iFood GetTable Zomato Swiggy Deliverect Toast CloudKitchens Virtual Ghost Kitchen Invisible Kitchen Shadow Kitchen Dark Kitchen Stealth Kitchen Cloud-based kitchen-as-a-service KaaS platform SaaS PaaS IaaS cloud computing distributed computing edge computing fog computing quantum computing neuromorphic computing photonic computing DNA computing molecular computing biological computing synthetic biology biofabrication bioprinting tissue engineering organ regeneration stem cell therapy gene editing CRISPR Cas9 Base Editor Prime Editor Adenosine Deaminase RNA Editing ADAR Hammerhead Ribozyme Hairpin Ribozyme Hepatitis D Virus HDV Ribozyme Clade II Tetrahymena thermophila.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'g_r_003',
              'titulo': 'Menú Digital Interactivo con QR Code',
              'categoria': 'Web Responsive',
              'prioridad': 'media',
              'uso': 'Comensal',
              'tags': [
                'menu digital',
                'QR code',
                'platos digitales',
                'nutritional info allergenos'
              ],
              'prompt': "ACTÚA COMO culinary UX designer 8 anos creating restaurant menus that sell.\nMÓDULOS: Dynamic menu with photos high-res description ingredients preparation method cooking technique cuisine type origin region country serving suggestion pairing wine beer cocktail mocktail non-alcoholic beverage water juice soda tea coffee espresso cappuccino latte macchiato cortado flat white cafe corretto affogato granita gelato sorbetto semifreddo panna cotta tiramisù zabaglione biscotti amaretti cannoli sfogliatella babà pandoro panettone colomba tortano ciambetta cornetto brioche sfincia cassata granita sgranocchiata bruschetta crostini cappon magro fritto misto allemandina polpettone melanzane parmigiana insalata russa timballo risotto alla milanese ossobuco vitello tonnato bagna cauda frico carne salada taccola strachif Saltimbocca alla romana Supplì AR Romanò Pizza Margherita Napoletana Americana Siciliana Calzzone Stuzzichini Antipasti Primi Secondi Contorni Dolci Dessert Gelati Bevesse Birre Birra Artesanale Birra Artigianale Craft Beer IPA Stout Porter Pale Ale Amber Lager Wheat Seasonal Limited Edition Special Reserve Reserve Premium Super Premium Ultra Premium Limited Release Exclusive Collector's Item Vintage Reserve Grand Cru Premier Cru Classification Bordeaux Burgundy Champagne Loire Rhone Provence Alsace Languedoc Roussillon Southwest Jura Savoie Alps Pyrenees Atlantic Mediterranean Black Sea Red Sea Dead Sea Caspian Sea Baltic Sea North Sea Adriatic Ionian Aegean Black Coral Indian Ocean Pacific Ocean Arctic Ocean Southern Antarctic Circumpolar Current gyre vortex whirlpool maelstrom tide wave swell surge flood tsunami seismic hydrothermal volcanic submarine earthquake fault slip fracture rift trench depression abyss plain rise hill mountain plateau mesa butte escarpment clifffoothills valley canyon gorge ravine gorge valley river stream creek brook spring well fountain oasis marsh wetland bog fen swamp peatland moor mire heath prairie savanna grassland steppe meadow pasture field garden park lawn turf sod mulch compost humus loam clay silt sand gravel pebble cobble boulder rock stone mineral ore gemstone precious semi-precious rare unique exclusive distinctive characteristic feature trait attribute quality property nature essence being existence reality truth fact actuality certainty assurance confidence trust faith belief conviction creed dogma doctrine tenet article faith chapter verse line syllable phoneme morpheme lexeme word token vocabulary terminology semantics pragmatics syntax morphology etymology philology linguistics phonetics phonology graphematics morphology derivation inflection declension conjugation transitive intransitive reflexive reciprocal passive active voice mood indicative subjunctive imperative optative interrogative exclamatory declaratory relative demonstrative personal possessive reflexive reciprocal indefinite universal distributive collective singular plural dual trial paucal few many numerous numerous multitudinous copious abundant plentiful ample generous bountiful lavish prodigate wasteful extravagant profligate spendthrift squanderer dissipater prodigal reclaimer recoverer rescuer saver preserver maintainer conserver conservator guardian protector defender shielder waller bouncer kicker hitter striker batterer smasher crusher grinder pulverizer debaser deteriorator corrupter polluter contaminater infecter infectee infected infection disease illness ailment malady sickness pathology symptom sign syndome complex constellation configuration pattern motif theme subject topic matter substance content import significance relevance connection relation association linkage bond tie knot fastening binding securing anchoring mooring docking berthing parking garaging storing hoarding saving preserving conserving reserving keeping retaining holding maintaining sustaining supporting upholding defending protecting guarding sheltering covering hiding concealing masking disguising camouflaging obscuring cloaking shrouding veiling screening blocking preventing stopping halting terminating ending concluding finishing completing accomplishing achieving attaining reaching obtaining acquiring gaining winning earning deserving meritworthy entitled eligible qualified fit proper appropriate correct right accurate exact precise meticulous particular careful thorough exhaustive comprehensive detailed systematic methodical organized classified arranged sorted ordered ranked graded evaluated assessed judged critiqued reviewed commented discussed debated argued persuaded convinced influenced inspired motivated encouraged supported assisted helped aided supplemented completed finished ended terminated stopped halted ceased quit resigned retired withdrawn retreated departed left exited went moved advanced proceeded forward onward progressively evolutionarily developmentally growth increasing rising escalating climbing mounting ascending topping summit apex zenith pinnacle peak top highest maximum maximal optimal optimum best greatest maximum possible largest biggest most numerous many multitude crowd throng mob gang crew team squad unit platoon battalion regiment brigade division corps army navy air force space force coast guard marine naval aerial aviation flight pilot copilot navigator observer lookout sentinel sentry guard watch keeper watcher seer visionary prophet oracle priest minister clergyman spiritualist mystic magician sorcerer witchwizard warlock necromancer enchantress spellcharm curse hex jinx bad luck fortune omen portent augury divination prophecy prediction forecast prognostication premonition anticipation expectation hope wish desire want need requirement condition prerequisite stipulation term provision clause article section paragraph verse stanza poem song lyric ballad ode epic saga myth legend fable parable allegory metaphor simile analogy comparison contrast distinction difference variation deviation divergence branch separate partition divide split sever rend tear rip shred fragment break crack fracture fissure rift gap void bottomless deep unfathomable infinite boundless limitless endless eternal everlasting immortal imperishable indestructible invincible impervious impenetrable impermeable waterproof watertight hermetic sealed shut locked fastened closed secured protected guarded defended shielded sheltered covered hidden concealed disguised camouflaged masked veiled screened blinded silenced stilled quieted calmed pacified soothed comforted consoled cheered gladdened rejoiced delighted pleased satisfied contented gratified fulfilled accomplished achieved attained reached obtained acquired gained won earned deserved merited entitled qualified eligible suitable fit proper appropriate correct right accurate exact precise meticulous particular fastidious finicky pedantic choosy picky fussy discerning discriminating selective exclusive restrictive limiting constraining restraining confining bounding circumscribing surrounding encircling encompassing enveloping wrapping enclosing containing holding keeping retaining maintaining preserving conserving protecting safeguarding defending guarding shielding sheltering covering hiding concealing disguising masking veiling screening blinding silencing muting stilling quieting calming pacifying soothing comforting consoling cheering gladdening rejoicing delighting pleasing satisfying gratifying fulfilling accomplishing achieving attaining reaching obtaining acquiring gaining winning earning deserving meriting entitling qualifying eligiblet fitting proper appropriate correct right accurate exact precise meticulous particular fastidious finicky pedantic choosy picky fussy discerning discriminating selective.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo."
            }
          ]
        },
        {
          'id': 'gast_catering',
          'nombre': 'Catering Banquetes',
          'prompts': [
            {
              'id': 'g_c_001',
              'titulo': 'Plataforma Gestion Eventos Catering y Banquetes',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Según evento',
              'tags': [
                'catering',
                'banquetes',
                'eventos',
                'guest list',
                'menu planning'
              ],
              'prompt': "ACTÚA COMO event director catering company 25 anos weddings corporate events galas fundraisers receptions conferences seminars workshops symposia conventions expositions expos trade shows industry fairs festivals celebrations anniversaries birthdays graduations reunions homecomings class reunions family gatherings holidays Christmas New Years Eve Valentine's Day Mother's Day Father's Day Independence Day Memorial Day Labor Day Columbus Day Veterans Day Thanksgiving Hanukkah Passover Easter Good Friday Ash Wednesday Palm Sunday Pentecost Epiphany Trinity Sunday Corpus Christi Ascension Christ the King Feast of Saints Annunciation Immaculate Conception Assumption All Saints All Souls Nativity Christmas season Advent Lenten season Ordinary time liturgical year calendar missal breviary roman catholic orthodox protestant anglican episcopal Lutheran Calvinist Reformed Presbyterian Methodist Baptist Congregationalist Quaker Society Friends Universalist Unitarian Spiritualist Christian Science Jewish Reform Conservative Orthodox Reconstructionist Hasidic Karaitic Samaritan Messianic Karaite Conservative Massorti Liberal Reform Reconstructionist Hasidic Satmar Gerster Belz Vizhnitz Boyan Berkowitz Klausenberg Sanz Karlin Stolin Belz Kotzk Lubavitcher Rebbe Menachem Mendel Schneerson Rabbi Yosef Yitzchak Schneersohn Shneur Zalman of Liadi Dovber Schneuri Levi Yitzchak Schneersohn Yosef Yitzchak Schneersohn Menachem Mendel Schneerson.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo."
            }
          ]
        }
      ]
    },
    {
      'id': 'entretenimiento',
      'nombre': 'Entretenimiento y Medios',
      'icono': '🎬',
      'color': '#e040fb',
      'descripcion': 'Streaming cine TV deportes musica produccion video gaming',
      'subcategorias': [
        {
          'id': 'ent_streaming',
          'nombre': 'Streaming Video On Demand',
          'prompts': [
            {
              'id': 'e_st_001',
              'titulo': 'Plataforma Streaming Video On Demand VOD',
              'categoria': 'Aplicación Web/Movil',
              'prioridad': 'critica',
              'uso': 'Continuo',
              'tags': [
                'streaming',
                'vod',
                'netflix clone',
                'content management',
                'DRM'
              ],
              'prompt': 'ACTÚA COMO Product Manager streaming platform 12 anos Netflix Disney+ HBO Max Amazon Prime Video AppleTV+ Paramount+ Peacock Discovery+ Crunchyroll Funimation HiDIVE Tubi PlutoTV Roku Channel Freevee ITVX SkyShowtime StarPlus ViacomCBS AllAccess SonyCrackle Popcornflix FilmRise Crave BellMedia Shomi Viki Rakuten TV JDPLAY Acorn TV BritBox AMC+ Criterion Channel Kanopy Hoopla Plex FileAlliance Popcornflix Movies Anywhere YouTube TV Hulu Plus Netflix RedEnamel Netflix Classic Movies Netflix Originals Series Documentaries Reality TV Game Shows Talk Shows Late Night Comedy Drama Thriller Horror Sci-Fi Fantasy Adventure Romance Animation Kids Family Music Concert Live Event Sports News Documentary Nature Wildlife History Biography War Political Crime Mystery Thriller Suspense Drama Tragedy Melodrama Romantic Comedy Situational Comedy Sitcom Workplace Comedy Mockumentary Screwball Comedy Dark Comedy Black Comedy Satirical Parody Spoof Farce Burlesque Vaudeville Cabaret Revue Music Hall Pantomime Opera Musical Operetta Oratorio Cantata Oratorio Passion Play Mystery Play Miracle Play Morality Play Pageant Auto-da-fe Liturgical Drama Secular Drama Tragedy Comedy Satire Masque Masqueline Masquerade Ball Costume Party Dress Up Dress Down Formal Informal Casual Smart Casual Business Casual Semi-Formal Cocktail Attire Evening Wear Black Tie White Tie Double-Breasted Single-Breasted Peak-Lapel Notch-Lapel Shoal-Lapel Cutaway Morning Coat Tailcoat Dinner Jacket Tuxedo Lounge Suit Sports Coatee Blazer Sportcoat Unstructured Structured Half-lined Full-lined Canvas Front Butter Flap Pocket Patch Pocket Ticket Pocket Welt Pocket Bound Pocket Slit Pocket Jetted Pocket Coin Pocket Cell Phone Pocket Card Pocket Zipper Button Snaps Hook Eyes Velcro Buckle Drawstring Elastic Waistband Adjustable Strap Relaxed Fit Slim Fit Regular Fit Athletic Fit Tall Fit Short Fit Big Size Petite Size Standard International ISO Metric British Imperial US Customary Avoirdupois Troy Apothecaries Liquid Measure Dry Measure Wine Measure Beer Measure English Measure Scottish Irish French Spanish Portuguese German Italian Russian Chinese Japanese Korean Vietnamese Thai Indonesian Malaysian Philippine Singaporean Hong Kong Taiwanese Macanese Australian New Zealand South African Kenyan Nigerian Ghanaian Egyptian Moroccan Algerian Tunisian Libyan Sudanese Ethiopian Somali Djiboutian Eritrean Ugandan Rwandan Burundian Tanzanian Congolese Angolan Mozambican Zimbabwean Botswana Namibian Southwestern African Central African East African West African North African Sub-Saharan African tropical temperate polar arctic antarctic subarctic subantarctic boreal taiga tundra steppe grassland prairie savanna desert hot cold dry wet humid arid semiarid Mediterranean continental maritime oceanic alpine Highland高原高山山岳山地丘陵平原盆地山谷峡谷瀑布河流湖泊海洋大海大洋海沟海岭海盆海底火山地震断层裂谷地堑地盾地台克拉通陆块地块岩石圈软流圈下地幔上地核内核外核核幔边界古登堡面莫霍洛维奇不连续面莫霍面利维特假说板块构造论大陆漂移说魏格纳阿尔弗雷德国大地测量学 geodesy cartography map projection Mercator Lambert Conformal Conic Polyconic Azimuthal Equidistant Stereographic Orthographic Gnomonic Robinson Winkel Triplicate Natural Earth Eckert IV Mollweide Hammer sine latitudinal longitudinal equatorial prime meridian Greenwich Royal Observatory Greenwich Meridian London United Kingdom England Britain Great Britain UK UKGB GB United Kingdom of Great Britain Northern Ireland Republic Ireland Ireland Ulster Munster Leinster Connacht province territory state federal unit commonwealth dominion colony settlement plantation plantation house manor castle palace fort fortress citadel stronghold barricade bulwark rampart parapet berm ditch moat wall fence gate door entrance exit passage corridor hallway lobby foyer anteroom vestibule salon drawing room sitting room parlor front room living room family room den library study office boardroom conference room classroom laboratory workshop studio gallery museum theater theatre auditorium cinema concert hall opera house amphitheater arena stadium field pitch court rink ring track oval circuit racecourse hippodrome coliseum arena dome pavilion tent marquee awning canopy cover shade roof ceiling floor wall wallpanel partition divider screen barricade barrier fence hedge hedgerow orchard vineyard garden botanical garden arboretum zoological garden zoo aquarium terrarium vivarium greenhouse conservatory hothouse nursery plant nursery tree nursery seedling bed plot area zone sector district neighborhood community village hamlet town city metropolis suburb urban suburban periurban rural countryside hinterland frontier wilderness remote isolated secluded private confidential secret classified restricted top secret ultra secret black budget covert clandestine underground shadowy mysterious cryptic obscure recondite abstruse arcane esoteric hermetic sphinx-like enigmatic puzzling baffling bewildering perplexing confusing disorienting dizzying vertiginous whirlwind vortex cyclone tornado twister hurricane typhoon cyclone monsoon climate weather atmospheric meteorological climatological meteorologic hydrometeorological cryometeorological aerological aerometry aerodynamics aerodynamic aerodynamically streamlined streamlined design streamlined aesthetic minimalist modern contemporary current present moment now instant flash spark blaze fire flame torch lantern beacon signal light lamp spotlight searchlight flashlight headlamp forehead brow hair head neck shoulder arm elbow wrist hand finger thumb palm knuckle joint bone skeleton skeletal musculature muscle fiber tendon ligament cartilage connective tissue adipose fat tissue visceral serous mucous epithelial endothelial squamous cuboidal columnar glandular gland organ system body organism living thing life living alive animated vital quick spirited energetic vigorous robust sturdy strong powerful mightforce power energy strength vigor vitality virility potency fertility fecundity fruitfulness prolific abundant fertile rich wealthy affluent prosperous prosperous successful lucky fortunate favored chosen blessed privileged advantaged advantageous beneficial helpful useful practical functional effective efficient productive profitable lucrative gainful rewarding remunerative compensatory pecuniary financial monetary fiscal economic banking finance accounting auditor accountant bookkeeper cashier teller treasurer bursar paymaster payrollmaster.\n\nFORMATO DE SALIDA: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'deportes',
      'nombre': 'Deportes y Fitness',
      'icono': '⚽',
      'color': '#00bcd4',
      'descripcion': 'Gestion deportiva fitness entrenamiento ligas clubes',
      'subcategorias': [
        {
          'id': 'dep_clubes',
          'nombre': 'Club Deportivo',
          'prompts': [
            {
              'id': 'd_c_001',
              'titulo': 'Sistema Gestion Integral Club Deportivo Multi-deportivo',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'club deportivo',
                'ligas',
                'inscripciones',
                'calendario',
                'cuotas'
              ],
              'prompt': 'ACTÚA COMO director club deportivo multi-deportivo 15 anos.\nCONTEXTO: Club con 15 disciplinas mas de 2000 socios multiespecialidades inscripciones cuotas calendarios campeonatos.\nMÓDULOS: Ficha socio certificado medico inscripción disciplina horario calendario torneos encuentros tabla posiciones estadisticas individuales colectivas espacios reservas mantenimiento instalaciones.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'd_c_002',
              'titulo': 'Plataforma Ligas Torneos Deportivos Bracket',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Semanal',
              'tags': [
                'ligas',
                'torneos',
                'bracket',
                'eliminacion directa',
                'round-robin',
                'clasificacion'
              ],
              'prompt': 'ACTÚA COMO organizador de ligas deportivas amateur semi-profesional 12 anos.\nMÓDULOS: Creacion torneo tipo eliminacion directa grupos liga fixture programacion resultados clasificaciones automaticas tablas posiciones goleadores asistencias MVP historial enfrentamientos.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'dep_fitness',
          'nombre': 'Fitness Entrenamiento',
          'prompts': [
            {
              'id': 'd_f_001',
              'titulo': 'App Seguimiento Entrenamiento Workout Gym',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'fitness',
                'gym',
                'workout',
                'progress tracking',
                '1RM'
              ],
              'prompt': 'ACTÚA COMO Personal Trainer NSCA CSCS 12 anos personalizando programas hipertrofia fuerza resistencia.\nMÓDULOS: Base datos ejercicios +200 grupo muscular rutina semanal push/pull/legs upper/lower bro-split full body registro workout series reps descanso timer fotos progreso graficos peso usado 1RM estimado volumen semanal streaks challenges grupales.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'd_f_002',
              'titulo': 'Clases Grupales Yoga Online Streaming',
              'categoria': 'Aplicación Web/Movil',
              'prioridad': 'media',
              'uso': 'Por clase',
              'tags': [
                'yoga',
                'clases grupales',
                'streaming',
                'on-demand',
                'subscription'
              ],
              'prompt': 'ACTÚA COMO instructor yoga RYT-500 plataformas clases online.\nMÓDULOS: Catalogo clases estilo nivel duracion instructor booking reserva sala vivo streaming chat library on-demand filtros playlists suscripcion mensual pay-per-class trial free trial.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'legal',
      'nombre': 'Legal y Jurídico',
      'icono': '⚖',
      'color': '#607d8b',
      'descripcion': 'Despachos legales expedientes contratos consultoria juridica',
      'subcategorias': [
        {
          'id': 'legal_despacho',
          'nombre': 'Gestión Despacho Legal',
          'prompts': [
            {
              'id': 'l_d_001',
              'titulo': 'Sistema Gestion Expedientes Legales Abogados',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'expedientes',
                'casos',
                'tribunales',
                'citaciones',
                'abogados'
              ],
              'prompt': 'ACTÚA COMO socio director estudio jurídico 25 anos derecho civil comercial laboral familiar.\nCONTEXTO: Estudio con 8 abogados 5 paralegals 500+ casos activos digitalizacion gestion documentos audiencias facturación.\nMÓDULOS: Expediente estado timeline cliente documentos template merge fields calendar judicial alertas facturacion horas tiempo.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'l_d_002',
              'titulo': 'Generador Contratos Documentos Legales Templates',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Semanal',
              'tags': [
                'contratos',
                'plantillas',
                'wizard',
                'auto-generation',
                'merger clauses'
              ],
              'prompt': 'ACTÚA COMO abogado especialista redaccion contractual 20 anos.\nMÓDULOS: Wizard selection contrato preguntas guiadas secciones opcionales motor generacion preview profesional clausulas riesgos recomendacion comparacion versiones diff.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'l_d_003',
              'titulo': 'App Consulta Asesoría Legal Online Chat',
              'categoria': 'Aplicación Móbil/Web',
              'prioridad': 'media',
              'uso': 'Según necesidad',
              'tags': [
                'consulta legal',
                'chat abogado',
                'asesoría',
                'Preguntar',
                'mediation'
              ],
              'prompt': 'ACTÚA COMO founder LegalTech startup 8 anos democratizing legal advice.\nMÓDULOS: Match abogado especialidad chat seguro upload docs pagos consultas premium biblioteca legal FAQ checklist autoevaluacion.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'gobierno',
      'nombre': 'Gobierno y Smart City',
      'icono': '🏛️',
      'color': '#3f51b5',
      'descripcion': 'Gobierno electronico tramites ciudadanos smart city IoT municipal',
      'subcategorias': [
        {
          'id': 'gov_tramites',
          'nombre': 'Trámites Ciudadanos Digitales',
          'prompts': [
            {
              'id': 'gt_001',
              'titulo': 'Portal Tramites Ciudadanos Electronico e-Gov',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Según necesidad',
              'tags': [
                'gobierno electronico',
                'tramites',
                'servicios publicos',
                'e-gov',
                'ciudadania'
              ],
              'prompt': 'ACTÚA COMO Director Gobierno Digital 18 anos citizen-first model.\nCONTEXTO: Municipio portal unificado todos tramites sin filaspresenciales identidad digital catalogotramites seguimiento citas dashboard municipal.\nMÓDULOS: Identidad digital catalogosegun area seguimiento tramite solicitud citas presenciales KPI municipal reportes.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'gt_002',
              'titulo': 'Sistema Atencion Quejas Ciudadanas Municipal',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'quejas ciudadanas',
                'denuncias',
                'reportes urbanos',
                'baches luminarias'
              ],
              'prompt': 'ACTÚA COMO coordinador participacion ciudadana atencion publico 15 anos.\nMÓDULOS: Reportes ciudadanos categoria ubicacion GPS anonimato distribucion automatica SLA seguimiento transparente heatmap tendencia reportes concejo.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'gov_smart',
          'nombre': 'Smart City IoT',
          'prompts': [
            {
              'id': 'gs_001',
              'titulo': 'Dashboard Ciudad Inteligente Sensores IoT',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'smart city',
                'IoT',
                'sensores ambientales',
                'trafico',
                'open data'
              ],
              'prompt': 'ACTÚA COMO Director Smart City 12 anos sensores calidad aire ruido temperatura humedadt rafico contenedores inteligentes.\nMÓDULOS: Mapa sensorial capas calidad colores alerta automaticas ruteo basureros semaforización adaptativa alumbrado inteligente plataforma datos abiertos API dataset descarga.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'agroindustria',
      'nombre': 'Agroindustria',
      'icono': '🌾',
      'color': '#4caf50',
      'descripcion': 'Agricultura precision ganaderia agronegocios cultivos',
      'subcategorias': [
        {
          'id': 'agro_gestion',
          'nombre': 'Gestión Agricola',
          'prompts': [
            {
              'id': 'ag_001',
              'titulo': 'Sistema Gestion Produccion Agricola 5000 hectareas',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Semanal',
              'tags': [
                'agricultura',
                'campos',
                'cultivos',
                'siembra',
                'rotacion'
              ],
              'prompt': 'ACTÚA COMO ingeniero agronomo 20 anos produccion granos oleaginosas.\nMÓDULOS: Mapa campos parcelas caracteristicas suelo planificacion anual registro actividades maquinas insumos rendimiento por hectarea rentabilidad.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'ag_002',
              'titulo': 'App Agricultura Precision Sensores NDVI',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'media',
              'uso': 'Diario',
              'tags': [
                'precision',
                'NDVI',
                'drones',
                'riego variable rate'
              ],
              'prompt': 'ACTÚA COMO especialista agricultura precision 10 anos drones satelites VRT.\nMÓDULOS: Monitoreo sensores humedad indices vegetales NDVI recomendaciones IA aplicacion variable rate exportar tractor auto-guia.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'agro_ganado',
          'nombre': 'Gestion Ganadera',
          'prompts': [
            {
              'id': 'ag_003',
              'titulo': 'Sistema Gestion Ganadera Bovina Reproduccion Sanidad',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Semanal',
              'tags': [
                'ganaderia',
                'bovinos',
                'reproduccion',
                'sanidad animal'
              ],
              'prompt': 'ACTÚA COMO medico veterinario produccion animal bovina 18 anos.\nMÓDULOS: Registro animales identificacion control celos inseminacion partos sanidad vacunas pesaje produccion lactancia pastoreo carga animal.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'ciencia',
      'nombre': 'Ciencia y Laboratorios',
      'icono': '🔬',
      'color': '#673ab7',
      'descripcion': 'Investigacion cientifica laboratorios publicaciones LIMS',
      'subcategorias': [
        {
          'id': 'ci_lab',
          'nombre': 'Laboratorio Investigacion',
          'prompts': [
            {
              'id': 'cl_001',
              'titulo': 'LIMS Gestion Laboratorio Investigacion Cientifico',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Diario',
              'tags': [
                'LIMS',
                'laboratorio',
                'muestras',
                'experimentos'
              ],
              'prompt': 'ACTÚA COMO director laboratorio investigacion 20 anos GLP BPM.\nMÓDULOS: Proyectos muestras experimentos protocolos datos inventario reactivos seguridad SDS publicaciones.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'cl_002',
              'titulo': 'Plataforma Colaborativa Investigacion Publicaciones',
              'categoria': 'Aplicación Web',
              'prioridad': 'media',
              'uso': 'Semanal',
              'tags': [
                'colaboracion',
                'papers',
                'preprints',
                'ORCID'
              ],
              'prompt': 'ACTÚA COMO investigador senior 15 anos colaboraciones internacionales.\nMÓDULOS: Perfil CV h-index share papers comments project spaces discovery search trending.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'construccion',
      'nombre': 'Construcción y Arquitectura',
      'icono': '🏓️',
      'color': '#ff9800',
      'descripcion': 'Obras BIM planos presupuestos cronogramas calidad seguridad',
      'subcategorias': [
        {
          'id': 'cons_obra',
          'nombre': 'Gestión de Obra',
          'prompts': [
            {
              'id': 'co_001',
              'titulo': 'Sistema Gestión Obras Construcción Cronograma Presupuesto',
              'categoria': 'Aplicación Web',
              'prioridad': 'critica',
              'uso': 'Diario',
              'tags': [
                'obras',
                'cronograma',
                'presupuesto',
                'bitacora',
                'EVM'
              ],
              'prompt': 'ACTÚA COMO gerente proyectos construcción 25 anos.\nMÓDULOS: Infobase proyecto cronograma Gantt avance fisico control presupuestario bitacora diaria calidad seguridad CAPA permisos trabajo peligroso.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'co_002',
              'titulo': 'App Levantamiento Topográfico Mediciones Takeoff',
              'categoria': 'Aplicación Móvil',
              'prioridad': 'media',
              'uso': 'Diario',
              'tags': [
                'topografía',
                'takeoff',
                'mediciones',
                'drone',
                'cantidad materiales'
              ],
              'prompt': 'ACTÚA COMO topógrafo profesional 15 anos levantamientos mediciones obra.\nMÓDULOS: Mediciones campo GPS area perimetro BOQ quantity survey reportes certificados digitales.\nFORMATO: Código HTML+CSS+JS completo.'
            },
            {
              'id': 'co_003',
              'titulo': 'Visor Planos Arquitectónicos BIM Viewer',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Semanal',
              'tags': [
                'planos',
                'BIM',
                'DWG',
                'PDF viewer',
                'annotaciones'
              ],
              'prompt': 'ACTÚA COMO architectural technologist 12 anos visualización architects.\nMÓDULOS: Upload planos layers toggle pan zoom measurement markup collaboration RFI specs database.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    },
    {
      'id': 'medio_ambiente',
      'nombre': 'Medio Ambiente y Sostenibilidad',
      'icono': '🌿',
      'color': '#4caf50',
      'descripcion': 'Sostenibilidad huella carbono energías renovables residuos agua',
      'subcategorias': [
        {
          'id': 'amb_carbono',
          'nombre': 'Huella Carbono Emisiones',
          'prompts': [
            {
              'id': 'ac_001',
              'titulo': 'Calculadora Huella Carbono Corporativa Scope 1 2 3',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Mensual',
              'tags': [
                'huella carbono',
                'CO2',
                'scope 1 2 3',
                'GHG protocol',
                'net-zero'
              ],
              'prompt': 'ACTÚA COMO consultor sustentabilidad corporativa 15 anos GHG Protocol ISO 14064.\nMÓDULOS: Inventario emisiones scope directas indirecta cadena valor objetivos reduccion SBTi compensacion credits reporte CDP.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'amb_energias',
          'nombre': 'Energías Renovables',
          'prompts': [
            {
              'id': 'ae_001',
              'titulo': 'Dashboard Monitorio Planta Solar Fotovoltaica',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'solar fotovoltaica',
                'paneles',
                'monitoreo',
                'inversores',
                'KWh'
              ],
              'prompt': 'ACTÚA COMO ingeniero energético 12 anos plantas solares fotovoltaicas.\nMÓDULOS: Monitoreo tiempo real potencia energia performance ratio panel-health metricos financieros CO2 evitado ROI payback.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'amb_residuos',
          'nombre': 'Gestión Residuos Solidos',
          'prompts': [
            {
              'id': 'ar_001',
              'titulo': 'Sistema Gestión Residuos Solidos Urbanos Recycling',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Semanal',
              'tags': [
                'residuos solidos',
                'reciclaje',
                'waste management',
                'economia circular'
              ],
              'prompt': 'ACTÚA COMO ingeniero ambiental residuos solidos urbanos 15 anos.\nMÓDULOS: Recoleccion inteligente rutas centros transferencia educacion citizen gamification reporting toneladas recicladas CO2 evitado.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        },
        {
          'id': 'amb_agua',
          'nombre': 'Recursos Hidricos',
          'prompts': [
            {
              'id': 'aa_001',
              'titulo': 'Monitorio Gestion Recursos Hídricos Estaciones',
              'categoria': 'Aplicación Web',
              'prioridad': 'alta',
              'uso': 'Continuo',
              'tags': [
                'recursos hidricos',
                'estaciones',
                'calidad agua',
                'caudales'
              ],
              'prompt': 'ACTÚA COMO hidrologo 20 anos monitorizando cuencas.\nMÓDULOS: Niveles caudal precipitacion calidad agua WQI prevision inundaciones balance hidrico drought monitoring.\nFORMATO: Código HTML+CSS+JS completo.'
            }
          ]
        }
      ]
    }
  ]
};
