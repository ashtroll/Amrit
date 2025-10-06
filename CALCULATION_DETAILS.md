# HMPI Analyzer - Calculation Methods

## Current Implementation Details

### 1. Heavy Metal Pollution Index (HPI)
**Formula**: HPI = Σ(Wi × Qi) / Σ(Wi)

Where:
- Wi = Weight of metal i (from METAL_STANDARDS)
- Qi = Sub-index = (Ci / Si) × 100
- Ci = Concentration of metal i in sample
- Si = WHO standard limit for metal i

**Implementation**:
```typescript
const subIndex = (metalValue / whoLimit) * 100;
weightedSum += weight * subIndex;
totalWeight += weight;
return weightedSum / totalWeight;
```

### 2. Heavy Metal Evaluation Index (HEI)
**Formula**: HEI = Σ(Ci / Si)

Where:
- Ci = Concentration of metal i in sample
- Si = WHO standard limit for metal i

**Implementation**:
```typescript
const ratio = metalValue / whoLimit;
sumRatio += ratio;
return sumRatio;
```

### 3. Contamination Degree (Cd)
**Formula**: Cd = Σ(Ci / Bi)

Where:
- Ci = Concentration of metal i in sample
- Bi = BIS standard limit for metal i

**Implementation**:
```typescript
const ratio = metalValue / bisLimit;
sumRatio += ratio;
return sumRatio;
```

## Metal Standards Used

| Metal | Symbol | WHO Limit (mg/L) | BIS Limit (mg/L) | Weight |
|-------|---------|------------------|------------------|---------|
| Iron | Fe | 0.3 | 0.3 | 3 |
| Manganese | Mn | 0.1 | 0.3 | 4 |
| Zinc | Zn | 3.0 | 5.0 | 2 |
| Copper | Cu | 2.0 | 0.05 | 3 |
| Chromium | Cr | 0.05 | 0.05 | 5 |
| Cadmium | Cd | 0.003 | 0.003 | 5 |
| Lead | Pb | 0.01 | 0.01 | 5 |
| Arsenic | As | 0.01 | 0.01 | 5 |
| Mercury | Hg | 0.006 | 0.001 | 5 |
| Nickel | Ni | 0.07 | 0.02 | 4 |

## Sample Calculation

For a sample with these values:
- Fe: 0.5 mg/L
- Mn: 0.15 mg/L
- Zn: 2.5 mg/L
- Cu: 0.04 mg/L
- Cr: 0.03 mg/L
- Cd: 0.002 mg/L
- Pb: 0.008 mg/L
- As: 0.009 mg/L
- Hg: 0.004 mg/L
- Ni: 0.05 mg/L

### HPI Calculation:
1. Fe: (0.5/0.3) × 100 × 3 = 166.67 × 3 = 500
2. Mn: (0.15/0.1) × 100 × 4 = 150 × 4 = 600
3. Zn: (2.5/3.0) × 100 × 2 = 83.33 × 2 = 166.67
4. Cu: (0.04/2.0) × 100 × 3 = 2 × 3 = 6
5. Cr: (0.03/0.05) × 100 × 5 = 60 × 5 = 300
6. Cd: (0.002/0.003) × 100 × 5 = 66.67 × 5 = 333.33
7. Pb: (0.008/0.01) × 100 × 5 = 80 × 5 = 400
8. As: (0.009/0.01) × 100 × 5 = 90 × 5 = 450
9. Hg: (0.004/0.006) × 100 × 5 = 66.67 × 5 = 333.33
10. Ni: (0.05/0.07) × 100 × 4 = 71.43 × 4 = 285.71

**Sum of weighted values**: 3375.04
**Sum of weights**: 41
**HPI = 3375.04 / 41 = 82.32**

### HEI Calculation:
Sum of all ratios: 0.5/0.3 + 0.15/0.1 + 2.5/3.0 + 0.04/2.0 + 0.03/0.05 + 0.002/0.003 + 0.008/0.01 + 0.009/0.01 + 0.004/0.006 + 0.05/0.07
= 1.67 + 1.5 + 0.83 + 0.02 + 0.6 + 0.67 + 0.8 + 0.9 + 0.67 + 0.71 = **8.37**

### Cd Calculation:
Sum of ratios using BIS limits: 0.5/0.3 + 0.15/0.3 + 2.5/5.0 + 0.04/0.05 + 0.03/0.05 + 0.002/0.003 + 0.008/0.01 + 0.009/0.01 + 0.004/0.001 + 0.05/0.02
= 1.67 + 0.5 + 0.5 + 0.8 + 0.6 + 0.67 + 0.8 + 0.9 + 4.0 + 2.5 = **12.94**

## Potential Issues Causing Lower Results

1. **Missing metals**: If any metal has NaN, null, or invalid values, it's excluded from calculations
2. **Different standards**: Your reference might use different WHO/BIS limits
3. **Rounding**: Results are rounded to 2 decimal places
4. **Weight values**: Different studies use different weight assignments

## Questions for Comparison:
1. What values are you getting vs. expected?
2. Which specific sample data are you testing?
3. Are you using different WHO/BIS standard limits?
4. Are you using different weight values for metals?