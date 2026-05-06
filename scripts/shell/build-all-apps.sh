#!/bin/bash
# THE AGENT - Build and Run All Applications

echo "========================================="
echo "THE AGENT Application Orchestrator"
echo "Building and deploying 146 applications"
echo "========================================="


echo "[110/255] Building Container Health Auditor..."
cd container-health-auditor
npm install --silent
npm run build
docker build -t container-health-auditor:latest . -q
cd ..

echo "[111/255] Building Dependency Graph Visualizer..."
cd dependency-graph-visualizer
npm install --silent
npm run build
docker build -t dependency-graph-visualizer:latest . -q
cd ..

echo "[112/255] Building Auto-Scaling Policy Engine..."
cd auto-scaling-policy-engine
npm install --silent
npm run build
docker build -t auto-scaling-policy-engine:latest . -q
cd ..

echo "[113/255] Building Cross-App API Gateway..."
cd cross-app-api-gateway
npm install --silent
npm run build
docker build -t cross-app-api-gateway:latest . -q
cd ..

echo "[114/255] Building Infrastructure Cost Optimizer..."
cd infrastructure-cost-optimizer
npm install --silent
npm run build
docker build -t infrastructure-cost-optimizer:latest . -q
cd ..

echo "[115/255] Building AI Log Pattern Analyzer..."
cd ai-log-pattern-analyzer
npm install --silent
npm run build
docker build -t ai-log-pattern-analyzer:latest . -q
cd ..

echo "[116/255] Building Real-Time Error Classifier..."
cd real-time-error-classifier
npm install --silent
npm run build
docker build -t real-time-error-classifier:latest . -q
cd ..

echo "[117/255] Building Deployment Drift Detector..."
cd deployment-drift-detector
npm install --silent
npm run build
docker build -t deployment-drift-detector:latest . -q
cd ..

echo "[118/255] Building Secret Vault Manager..."
cd secret-vault-manager
npm install --silent
npm run build
docker build -t secret-vault-manager:latest . -q
cd ..

echo "[119/255] Building Multi-Tenant Role Engine..."
cd multi-tenant-role-engine
npm install --silent
npm run build
docker build -t multi-tenant-role-engine:latest . -q
cd ..

echo "[120/255] Building Data Lineage Tracker..."
cd data-lineage-tracker
npm install --silent
npm run build
docker build -t data-lineage-tracker:latest . -q
cd ..

echo "[121/255] Building Automated Rollback AI..."
cd automated-rollback-ai
npm install --silent
npm run build
docker build -t automated-rollback-ai:latest . -q
cd ..

echo "[122/255] Building Canary Release Manager..."
cd canary-release-manager
npm install --silent
npm run build
docker build -t canary-release-manager:latest . -q
cd ..

echo "[123/255] Building Synthetic User Simulator..."
cd synthetic-user-simulator
npm install --silent
npm run build
docker build -t synthetic-user-simulator:latest . -q
cd ..

echo "[124/255] Building Incident Response Copilot..."
cd incident-response-copilot
npm install --silent
npm run build
docker build -t incident-response-copilot:latest . -q
cd ..

echo "[125/255] Building SLA Compliance Monitor..."
cd sla-compliance-monitor
npm install --silent
npm run build
docker build -t sla-compliance-monitor:latest . -q
cd ..

echo "[126/255] Building Internal Knowledge Embedding Engine..."
cd internal-knowledge-embedding-engine
npm install --silent
npm run build
docker build -t internal-knowledge-embedding-engine:latest . -q
cd ..

echo "[127/255] Building Cross-App Search..."
cd cross-app-search
npm install --silent
npm run build
docker build -t cross-app-search:latest . -q
cd ..

echo "[128/255] Building Sentinel Self-Diagnostics Console..."
cd sentinel-self-diagnostics-console
npm install --silent
npm run build
docker build -t sentinel-self-diagnostics-console:latest . -q
cd ..

echo "[129/255] Building Remote Patient Monitoring AI..."
cd remote-patient-monitoring-ai
npm install --silent
npm run build
docker build -t remote-patient-monitoring-ai:latest . -q
cd ..

echo "[130/255] Building Predictive Disease Risk Model..."
cd predictive-disease-risk-model
npm install --silent
npm run build
docker build -t predictive-disease-risk-model:latest . -q
cd ..

echo "[131/255] Building Hospital Resource Allocator..."
cd hospital-resource-allocator
npm install --silent
npm run build
docker build -t hospital-resource-allocator:latest . -q
cd ..

echo "[132/255] Building Medical Claims Validator..."
cd medical-claims-validator
npm install --silent
npm run build
docker build -t medical-claims-validator:latest . -q
cd ..

echo "[133/255] Building Adaptive Curriculum Engine..."
cd adaptive-curriculum-engine
npm install --silent
npm run build
docker build -t adaptive-curriculum-engine:latest . -q
cd ..

echo "[134/255] Building Student Performance Predictor..."
cd student-performance-predictor
npm install --silent
npm run build
docker build -t student-performance-predictor:latest . -q
cd ..

echo "[135/255] Building AI Exam Generator..."
cd ai-exam-generator
npm install --silent
npm run build
docker build -t ai-exam-generator:latest . -q
cd ..

echo "[136/255] Building Academic Integrity Detector..."
cd academic-integrity-detector
npm install --silent
npm run build
docker build -t academic-integrity-detector:latest . -q
cd ..

echo "[137/255] Building Fraud Detection Engine..."
cd fraud-detection-engine
npm install --silent
npm run build
docker build -t fraud-detection-engine:latest . -q
cd ..

echo "[138/255] Building Microcredit Risk Scorer..."
cd microcredit-risk-scorer
npm install --silent
npm run build
docker build -t microcredit-risk-scorer:latest . -q
cd ..

echo "[139/255] Building Automated Compliance Monitor..."
cd automated-compliance-monitor
npm install --silent
npm run build
docker build -t automated-compliance-monitor:latest . -q
cd ..

echo "[140/255] Building Treasury Forecasting AI..."
cd treasury-forecasting-ai
npm install --silent
npm run build
docker build -t treasury-forecasting-ai:latest . -q
cd ..

echo "[141/255] Building Crop Yield Predictor..."
cd crop-yield-predictor
npm install --silent
npm run build
docker build -t crop-yield-predictor:latest . -q
cd ..

echo "[142/255] Building Soil Health Analyzer..."
cd soil-health-analyzer
npm install --silent
npm run build
docker build -t soil-health-analyzer:latest . -q
cd ..

echo "[143/255] Building Supply Chain Route Optimizer..."
cd supply-chain-route-optimizer
npm install --silent
npm run build
docker build -t supply-chain-route-optimizer:latest . -q
cd ..

echo "[144/255] Building Commodity Price Forecast Engine..."
cd commodity-price-forecast-engine
npm install --silent
npm run build
docker build -t commodity-price-forecast-engine:latest . -q
cd ..

echo "[145/255] Building Predictive Maintenance AI..."
cd predictive-maintenance-ai
npm install --silent
npm run build
docker build -t predictive-maintenance-ai:latest . -q
cd ..

echo "[146/255] Building Factory Energy Optimizer..."
cd factory-energy-optimizer
npm install --silent
npm run build
docker build -t factory-energy-optimizer:latest . -q
cd ..

echo "[147/255] Building Inventory Demand Forecaster..."
cd inventory-demand-forecaster
npm install --silent
npm run build
docker build -t inventory-demand-forecaster:latest . -q
cd ..

echo "[148/255] Building Quality Defect Vision System..."
cd quality-defect-vision-system
npm install --silent
npm run build
docker build -t quality-defect-vision-system:latest . -q
cd ..

echo "[149/255] Building Script Co-Writer..."
cd script-co-writer
npm install --silent
npm run build
docker build -t script-co-writer:latest . -q
cd ..

echo "[150/255] Building AI Music Arrangement Assistant..."
cd ai-music-arrangement-assistant
npm install --silent
npm run build
docker build -t ai-music-arrangement-assistant:latest . -q
cd ..

echo "[151/255] Building Video Scene Generator..."
cd video-scene-generator
npm install --silent
npm run build
docker build -t video-scene-generator:latest . -q
cd ..

echo "[152/255] Building Brand Narrative Synthesizer..."
cd brand-narrative-synthesizer
npm install --silent
npm run build
docker build -t brand-narrative-synthesizer:latest . -q
cd ..

echo "[153/255] Building Smart Logistics Optimizer..."
cd smart-logistics-optimizer
npm install --silent
npm run build
docker build -t smart-logistics-optimizer:latest . -q
cd ..

echo "[154/255] Building Retail Demand Intelligence..."
cd retail-demand-intelligence
npm install --silent
npm run build
docker build -t retail-demand-intelligence:latest . -q
cd ..

echo "[155/255] Building Smart Energy Consumption Monitor..."
cd smart-energy-consumption-monitor
npm install --silent
npm run build
docker build -t smart-energy-consumption-monitor:latest . -q
cd ..

echo "[156/255] Building Urban Waste Optimization Engine..."
cd urban-waste-optimization-engine
npm install --silent
npm run build
docker build -t urban-waste-optimization-engine:latest . -q
cd ..

echo "[157/255] Building Telemedicine Session Optimizer..."
cd telemedicine-session-optimizer
npm install --silent
npm run build
docker build -t telemedicine-session-optimizer:latest . -q
cd ..

echo "[158/255] Building Digital Identity Verifier..."
cd digital-identity-verifier
npm install --silent
npm run build
docker build -t digital-identity-verifier:latest . -q
cd ..

echo "[159/255] Building Insurance Risk Intelligence Engine..."
cd insurance-risk-intelligence-engine
npm install --silent
npm run build
docker build -t insurance-risk-intelligence-engine:latest . -q
cd ..

echo "[160/255] Building Smart Contract Risk Scanner..."
cd smart-contract-risk-scanner
npm install --silent
npm run build
docker build -t smart-contract-risk-scanner:latest . -q
cd ..

echo "[161/255] Building AI Marketplace Engine..."
cd ai-marketplace-engine
npm install --silent
npm run build
docker build -t ai-marketplace-engine:latest . -q
cd ..

echo "[162/255] Building Cross-App Data Fabric..."
cd cross-app-data-fabric
npm install --silent
npm run build
docker build -t cross-app-data-fabric:latest . -q
cd ..

echo "[163/255] Building Federated Learning Coordinator..."
cd federated-learning-coordinator
npm install --silent
npm run build
docker build -t federated-learning-coordinator:latest . -q
cd ..

echo "[164/255] Building Edge Deployment Manager..."
cd edge-deployment-manager
npm install --silent
npm run build
docker build -t edge-deployment-manager:latest . -q
cd ..

echo "[165/255] Building API Monetization Portal..."
cd api-monetization-portal
npm install --silent
npm run build
docker build -t api-monetization-portal:latest . -q
cd ..

echo "[166/255] Building Usage Billing Engine..."
cd usage-billing-engine
npm install --silent
npm run build
docker build -t usage-billing-engine:latest . -q
cd ..

echo "[167/255] Building Trust and Governance Layer..."
cd trust-and-governance-layer
npm install --silent
npm run build
docker build -t trust-and-governance-layer:latest . -q
cd ..

echo "[168/255] Building Bias Detection Engine..."
cd bias-detection-engine
npm install --silent
npm run build
docker build -t bias-detection-engine:latest . -q
cd ..

echo "[169/255] Building AI Explainability Console..."
cd ai-explainability-console
npm install --silent
npm run build
docker build -t ai-explainability-console:latest . -q
cd ..

echo "[170/255] Building Model Version Registry..."
cd model-version-registry
npm install --silent
npm run build
docker build -t model-version-registry:latest . -q
cd ..

echo "[171/255] Building Model Performance Drift AI..."
cd model-performance-drift-ai
npm install --silent
npm run build
docker build -t model-performance-drift-ai:latest . -q
cd ..

echo "[172/255] Building Synthetic Data Generator..."
cd synthetic-data-generator
npm install --silent
npm run build
docker build -t synthetic-data-generator:latest . -q
cd ..

echo "[173/255] Building Privacy Risk Assessor..."
cd privacy-risk-assessor
npm install --silent
npm run build
docker build -t privacy-risk-assessor:latest . -q
cd ..

echo "[174/255] Building Data Anonymization Engine..."
cd data-anonymization-engine
npm install --silent
npm run build
docker build -t data-anonymization-engine:latest . -q
cd ..

echo "[175/255] Building Prompt Optimization Engine..."
cd prompt-optimization-engine
npm install --silent
npm run build
docker build -t prompt-optimization-engine:latest . -q
cd ..

echo "[176/255] Building Agent Collaboration Framework..."
cd agent-collaboration-framework
npm install --silent
npm run build
docker build -t agent-collaboration-framework:latest . -q
cd ..

echo "[177/255] Building Knowledge Graph Builder..."
cd knowledge-graph-builder
npm install --silent
npm run build
docker build -t knowledge-graph-builder:latest . -q
cd ..

echo "[178/255] Building Semantic Workflow Engine..."
cd semantic-workflow-engine
npm install --silent
npm run build
docker build -t semantic-workflow-engine:latest . -q
cd ..

echo "[179/255] Building Digital Twin Builder..."
cd digital-twin-builder
npm install --silent
npm run build
docker build -t digital-twin-builder:latest . -q
cd ..

echo "[180/255] Building Scenario Simulation Engine..."
cd scenario-simulation-engine
npm install --silent
npm run build
docker build -t scenario-simulation-engine:latest . -q
cd ..

echo "[181/255] Building City Digital Twin..."
cd city-digital-twin
npm install --silent
npm run build
docker build -t city-digital-twin:latest . -q
cd ..

echo "[182/255] Building University Digital Twin..."
cd university-digital-twin
npm install --silent
npm run build
docker build -t university-digital-twin:latest . -q
cd ..

echo "[183/255] Building Hospital Digital Twin..."
cd hospital-digital-twin
npm install --silent
npm run build
docker build -t hospital-digital-twin:latest . -q
cd ..

echo "[184/255] Building Farm Digital Twin..."
cd farm-digital-twin
npm install --silent
npm run build
docker build -t farm-digital-twin:latest . -q
cd ..

echo "[185/255] Building Supply Chain Digital Twin..."
cd supply-chain-digital-twin
npm install --silent
npm run build
docker build -t supply-chain-digital-twin:latest . -q
cd ..

echo "[186/255] Building Energy Grid Digital Twin..."
cd energy-grid-digital-twin
npm install --silent
npm run build
docker build -t energy-grid-digital-twin:latest . -q
cd ..

echo "[187/255] Building Transportation Network Twin..."
cd transportation-network-twin
npm install --silent
npm run build
docker build -t transportation-network-twin:latest . -q
cd ..

echo "[188/255] Building Manufacturing Ecosystem Twin..."
cd manufacturing-ecosystem-twin
npm install --silent
npm run build
docker build -t manufacturing-ecosystem-twin:latest . -q
cd ..

echo "[189/255] Building Retail Ecosystem Twin..."
cd retail-ecosystem-twin
npm install --silent
npm run build
docker build -t retail-ecosystem-twin:latest . -q
cd ..

echo "[190/255] Building Climate Impact Twin..."
cd climate-impact-twin
npm install --silent
npm run build
docker build -t climate-impact-twin:latest . -q
cd ..

echo "[191/255] Building Smart Campus Operations Engine..."
cd smart-campus-operations-engine
npm install --silent
npm run build
docker build -t smart-campus-operations-engine:latest . -q
cd ..

echo "[192/255] Building Global Trade Simulation Engine..."
cd global-trade-simulation-engine
npm install --silent
npm run build
docker build -t global-trade-simulation-engine:latest . -q
cd ..

echo "[193/255] Building Disaster Preparedness Simulator..."
cd disaster-preparedness-simulator
npm install --silent
npm run build
docker build -t disaster-preparedness-simulator:latest . -q
cd ..

echo "[194/255] Building AI Governance Analytics Hub..."
cd ai-governance-analytics-hub
npm install --silent
npm run build
docker build -t ai-governance-analytics-hub:latest . -q
cd ..

echo "[195/255] Building Cyber Threat Landscape Analyzer..."
cd cyber-threat-landscape-analyzer
npm install --silent
npm run build
docker build -t cyber-threat-landscape-analyzer:latest . -q
cd ..

echo "[196/255] Building Quantum Risk Modeling Engine..."
cd quantum-risk-modeling-engine
npm install --silent
npm run build
docker build -t quantum-risk-modeling-engine:latest . -q
cd ..

echo "[197/255] Building Autonomous Robotics Coordination Engine..."
cd autonomous-robotics-coordination-engine
npm install --silent
npm run build
docker build -t autonomous-robotics-coordination-engine:latest . -q
cd ..

echo "[198/255] Building Drone Fleet Intelligence Manager..."
cd drone-fleet-intelligence-manager
npm install --silent
npm run build
docker build -t drone-fleet-intelligence-manager:latest . -q
cd ..

echo "[199/255] Building AI Knowledge Compression Lab..."
cd ai-knowledge-compression-lab
npm install --silent
npm run build
docker build -t ai-knowledge-compression-lab:latest . -q
cd ..

echo "[200/255] Building Strategic Scenario Forecast Engine..."
cd strategic-scenario-forecast-engine
npm install --silent
npm run build
docker build -t strategic-scenario-forecast-engine:latest . -q
cd ..

echo "[201/255] Building Autonomous Incident Resolver..."
cd autonomous-incident-resolver
npm install --silent
npm run build
docker build -t autonomous-incident-resolver:latest . -q
cd ..

echo "[202/255] Building AI Resource Arbitrage Engine..."
cd ai-resource-arbitrage-engine
npm install --silent
npm run build
docker build -t ai-resource-arbitrage-engine:latest . -q
cd ..

echo "[203/255] Building Predictive Policy Engine..."
cd predictive-policy-engine
npm install --silent
npm run build
docker build -t predictive-policy-engine:latest . -q
cd ..

echo "[204/255] Building Smart Contract Executor..."
cd smart-contract-executor
npm install --silent
npm run build
docker build -t smart-contract-executor:latest . -q
cd ..

echo "[205/255] Building Risk Exposure Forecaster..."
cd risk-exposure-forecaster
npm install --silent
npm run build
docker build -t risk-exposure-forecaster:latest . -q
cd ..

echo "[206/255] Building Crisis Simulation AI..."
cd crisis-simulation-ai
npm install --silent
npm run build
docker build -t crisis-simulation-ai:latest . -q
cd ..

echo "[207/255] Building Climate Impact Modeler..."
cd climate-impact-modeler
npm install --silent
npm run build
docker build -t climate-impact-modeler:latest . -q
cd ..

echo "[208/255] Building Urban Traffic Optimizer..."
cd urban-traffic-optimizer
npm install --silent
npm run build
docker build -t urban-traffic-optimizer:latest . -q
cd ..

echo "[209/255] Building Renewable Grid Balancer..."
cd renewable-grid-balancer
npm install --silent
npm run build
docker build -t renewable-grid-balancer:latest . -q
cd ..

echo "[210/255] Building Carbon Credit Tracker..."
cd carbon-credit-tracker
npm install --silent
npm run build
docker build -t carbon-credit-tracker:latest . -q
cd ..

echo "[211/255] Building Public Health Surveillance AI..."
cd public-health-surveillance-ai
npm install --silent
npm run build
docker build -t public-health-surveillance-ai:latest . -q
cd ..

echo "[212/255] Building Disaster Response Allocator..."
cd disaster-response-allocator
npm install --silent
npm run build
docker build -t disaster-response-allocator:latest . -q
cd ..

echo "[213/255] Building Election Sentiment Analyzer..."
cd election-sentiment-analyzer
npm install --silent
npm run build
docker build -t election-sentiment-analyzer:latest . -q
cd ..

echo "[214/255] Building Misinformation Detector..."
cd misinformation-detector
npm install --silent
npm run build
docker build -t misinformation-detector:latest . -q
cd ..

echo "[215/255] Building Autonomous Audit Engine..."
cd autonomous-audit-engine
npm install --silent
npm run build
docker build -t autonomous-audit-engine:latest . -q
cd ..

echo "[216/255] Building Cross-Border Trade Optimizer..."
cd cross-border-trade-optimizer
npm install --silent
npm run build
docker build -t cross-border-trade-optimizer:latest . -q
cd ..

echo "[217/255] Building Logistics Fleet Autopilot..."
cd logistics-fleet-autopilot
npm install --silent
npm run build
docker build -t logistics-fleet-autopilot:latest . -q
cd ..

echo "[218/255] Building AI Legal Clause Analyzer..."
cd ai-legal-clause-analyzer
npm install --silent
npm run build
docker build -t ai-legal-clause-analyzer:latest . -q
cd ..

echo "[219/255] Building Regulatory Update Scanner..."
cd regulatory-update-scanner
npm install --silent
npm run build
docker build -t regulatory-update-scanner:latest . -q
cd ..

echo "[220/255] Building Geopolitical Risk Monitor..."
cd geopolitical-risk-monitor
npm install --silent
npm run build
docker build -t geopolitical-risk-monitor:latest . -q
cd ..

echo "[221/255] Building Autonomous Decision Optimizer..."
cd autonomous-decision-optimizer
npm install --silent
npm run build
docker build -t autonomous-decision-optimizer:latest . -q
cd ..

echo "[222/255] Building Self-Healing Infrastructure Engine..."
cd self-healing-infrastructure-engine
npm install --silent
npm run build
docker build -t self-healing-infrastructure-engine:latest . -q
cd ..

echo "[223/255] Building Autonomous Budget Allocator..."
cd autonomous-budget-allocator
npm install --silent
npm run build
docker build -t autonomous-budget-allocator:latest . -q
cd ..

echo "[224/255] Building Cross-System Stability Controller..."
cd cross-system-stability-controller
npm install --silent
npm run build
docker build -t cross-system-stability-controller:latest . -q
cd ..

echo "[225/255] Building Autonomous Compliance Enforcer..."
cd autonomous-compliance-enforcer
npm install --silent
npm run build
docker build -t autonomous-compliance-enforcer:latest . -q
cd ..

echo "[226/255] Building AI Risk Rebalancing Engine..."
cd ai-risk-rebalancing-engine
npm install --silent
npm run build
docker build -t ai-risk-rebalancing-engine:latest . -q
cd ..

echo "[227/255] Building Dynamic Policy Adjustment Engine..."
cd dynamic-policy-adjustment-engine
npm install --silent
npm run build
docker build -t dynamic-policy-adjustment-engine:latest . -q
cd ..

echo "[228/255] Building Strategic Resource Redistributor..."
cd strategic-resource-redistributor
npm install --silent
npm run build
docker build -t strategic-resource-redistributor:latest . -q
cd ..

echo "[229/255] Building Real-Time Economic Signal Analyzer..."
cd real-time-economic-signal-analyzer
npm install --silent
npm run build
docker build -t real-time-economic-signal-analyzer:latest . -q
cd ..

echo "[230/255] Building Autonomous System Governance Core..."
cd autonomous-system-governance-core
npm install --silent
npm run build
docker build -t autonomous-system-governance-core:latest . -q
cd ..

echo "[231/255] Building Self-Improving Model Trainer..."
cd self-improving-model-trainer
npm install --silent
npm run build
docker build -t self-improving-model-trainer:latest . -q
cd ..

echo "[232/255] Building AI Strategy Recommender..."
cd ai-strategy-recommender
npm install --silent
npm run build
docker build -t ai-strategy-recommender:latest . -q
cd ..

echo "[233/255] Building Innovation Opportunity Detector..."
cd innovation-opportunity-detector
npm install --silent
npm run build
docker build -t innovation-opportunity-detector:latest . -q
cd ..

echo "[234/255] Building Cross-Industry Pattern Miner..."
cd cross-industry-pattern-miner
npm install --silent
npm run build
docker build -t cross-industry-pattern-miner:latest . -q
cd ..

echo "[235/255] Building Emergent Behavior Monitor..."
cd emergent-behavior-monitor
npm install --silent
npm run build
docker build -t emergent-behavior-monitor:latest . -q
cd ..

echo "[236/255] Building Ethical Governance AI..."
cd ethical-governance-ai
npm install --silent
npm run build
docker build -t ethical-governance-ai:latest . -q
cd ..

echo "[237/255] Building Societal Impact Simulator..."
cd societal-impact-simulator
npm install --silent
npm run build
docker build -t societal-impact-simulator:latest . -q
cd ..

echo "[238/255] Building Human-AI Collaboration Optimizer..."
cd human-ai-collaboration-optimizer
npm install --silent
npm run build
docker build -t human-ai-collaboration-optimizer:latest . -q
cd ..

echo "[239/255] Building Creativity Amplifier..."
cd creativity-amplifier
npm install --silent
npm run build
docker build -t creativity-amplifier:latest . -q
cd ..

echo "[240/255] Building Organizational Design Recommender..."
cd organizational-design-recommender
npm install --silent
npm run build
docker build -t organizational-design-recommender:latest . -q
cd ..

echo "[241/255] Building Decision Confidence Estimator..."
cd decision-confidence-estimator
npm install --silent
npm run build
docker build -t decision-confidence-estimator:latest . -q
cd ..

echo "[242/255] Building Strategic Risk Balancer..."
cd strategic-risk-balancer
npm install --silent
npm run build
docker build -t strategic-risk-balancer:latest . -q
cd ..

echo "[243/255] Building Knowledge Compression Engine..."
cd knowledge-compression-engine
npm install --silent
npm run build
docker build -t knowledge-compression-engine:latest . -q
cd ..

echo "[244/255] Building Autonomous Refactoring AI..."
cd autonomous-refactoring-ai
npm install --silent
npm run build
docker build -t autonomous-refactoring-ai:latest . -q
cd ..

echo "[245/255] Building Cross-App Performance Synthesizer..."
cd cross-app-performance-synthesizer
npm install --silent
npm run build
docker build -t cross-app-performance-synthesizer:latest . -q
cd ..

echo "[246/255] Building Sentiment-Aware UX Adapter..."
cd sentiment-aware-ux-adapter
npm install --silent
npm run build
docker build -t sentiment-aware-ux-adapter:latest . -q
cd ..

echo "[247/255] Building Real-Time Persona Engine..."
cd real-time-persona-engine
npm install --silent
npm run build
docker build -t real-time-persona-engine:latest . -q
cd ..

echo "[248/255] Building AI Skill Transfer Engine..."
cd ai-skill-transfer-engine
npm install --silent
npm run build
docker build -t ai-skill-transfer-engine:latest . -q
cd ..

echo "[249/255] Building Multi-Agent Negotiation Engine..."
cd multi-agent-negotiation-engine
npm install --silent
npm run build
docker build -t multi-agent-negotiation-engine:latest . -q
cd ..

echo "[250/255] Building Cognitive Load Monitor..."
cd cognitive-load-monitor
npm install --silent
npm run build
docker build -t cognitive-load-monitor:latest . -q
cd ..

echo "[251/255] Building Executive Brief Generator..."
cd executive-brief-generator
npm install --silent
npm run build
docker build -t executive-brief-generator:latest . -q
cd ..

echo "[252/255] Building Narrative Intelligence Engine..."
cd narrative-intelligence-engine
npm install --silent
npm run build
docker build -t narrative-intelligence-engine:latest . -q
cd ..

echo "[253/255] Building AI Portfolio Demonstrator..."
cd ai-portfolio-demonstrator
npm install --silent
npm run build
docker build -t ai-portfolio-demonstrator:latest . -q
cd ..

echo "[254/255] Building Sentinel Command Deck..."
cd sentinel-command-deck
npm install --silent
npm run build
docker build -t sentinel-command-deck:latest . -q
cd ..

echo "[255/255] Building Sentinel Conscious State Dashboard..."
cd sentinel-conscious-state-dashboard
npm install --silent
npm run build
docker build -t sentinel-conscious-state-dashboard:latest . -q
cd ..

echo ""
echo "========================================="
echo "All applications built successfully!"
echo "========================================="
