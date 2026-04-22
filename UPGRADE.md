# Risk Intelligence Platform Upgrade Walkthrough

This upgrade transforms the existing ISO 31000 application into a sophisticated **Strategic Risk Intelligence Platform**. We have added modular depth to the risk assessment process, integrating best practices like SPRETZEL, Root Cause Analysis (RCA), and SWOT.

## 1. Modular Architecture

The upgrade introduces a new directory `src/components/` containing specialized modules:

- [RootCauseAnalysis.tsx](file:///Users/abduullah/Downloads/31000iso-main/src/components/RootCauseAnalysis.tsx): Logic for 5 Whys and Fishbone (Ishikawa).
- [SWOTAnalysis.tsx](file:///Users/abduullah/Downloads/31000iso-main/src/components/SWOTAnalysis.tsx): Strategic matrix for Strengths, Weaknesses, Opportunities, and Threats.
- [SPRETZELMapping.tsx](file:///Users/abduullah/Downloads/31000iso-main/src/components/SPRETZELMapping.tsx): Governance context across 9 business dimensions.
- [StakeholderManagement.tsx](file:///Users/abduullah/Downloads/31000iso-main/src/components/StakeholderManagement.tsx): Accountability and escalation workflows.
- [KRIModule.tsx](file:///Users/abduullah/Downloads/31000iso-main/src/components/KRIModule.tsx): Predictive monitoring and threshold alerts.
- [RiskDescription.tsx](file:///Users/abduullah/Downloads/31000iso-main/src/components/RiskDescription.tsx): Structured risk statement with context and reasoning.

## 2. Integrated Workflow

### Step 1: Core Assessment
In the `Assessment` tab, users start with **Core Analysis** (Asset, Threat, Vulnerability). This maintains simplicity for rapid data entry.

### Step 2: Advanced Intelligence
By toggling to **Advanced Intelligence**, the platform unfolds specialized sections:
- **RCA**: Deep dive into the origins of the risk.
- **SWOT**: Evaluate external and internal strategic factors.
- **SPRETZEL**: Map the risk against People, Resources, Legal, etc.
- **Stakeholders**: Assign owners and map influence/interest.

### Step 3: AI Strategic Analysis
A new **"✨ AI Strategic Analysis"** button uses Gemini 1.5 Flash to automatically populate these deep-dive fields based on the core risk data, providing an "Enterprise-Grade" starting point.

## 3. Key Enhancements

### Root Cause Analysis (RCA)
- **5 Whys**: Chain of causation.
- **Fishbone**: Categorization into People, Process, Technology, Environment, and Management.
- **AI Explainability**: Includes confidence scores and reasoning for the identified root cause.

### SPRETZEL Framework
- Provides a comprehensive business context, moving beyond technical scoring into strategic governance.

### KRI & Predictive Trends
- Shifts from static monitoring to predictive alerts based on user-defined thresholds.

### AI Explainability Layer
- Applied across scoring, RCA, and SWOT.
- Displays transparency symbols and reasoning explanations to build trust with enterprise auditors.

## 4. Persistent Data
The Firestore persistence layer has been updated to store these new complex objects, ensuring that advanced analysis is saved and available in the History and Register views.

---

> [!TIP]
> Use the **"Advanced Intelligence"** view specifically for "High" and "Critical" risks to ensure a deeper level of mitigation and accountability as per ISO 31000:2018 best practices.
