/**
 * The reactions a balancing question is drawn from, as their two sides.
 * The coefficients are computed, never stored: see `balanceReaction`.
 *
 * Two reactions of the source list appear once here, and the undecyl
 * radical C₁₁H₂₃ is written as the alkane it stands for, undecane C₁₁H₂₄.
 */
export const REACTIONS: ReadonlyArray<{
  reactants: readonly string[];
  products: readonly string[];
}> = [
  { reactants: ['Sb2S3', 'HCl'], products: ['H3SbCl6', 'H2S'] },
  { reactants: ['C6H12O6', 'O2'], products: ['H2O', 'CO2'] },
  { reactants: ['H2', 'O2'], products: ['H2O'] },
  { reactants: ['P', 'O2'], products: ['P2O5'] },
  { reactants: ['NH3', 'O2'], products: ['NO', 'H2O'] },
  { reactants: ['C27H48O', 'O2'], products: ['CO2', 'H2O'] },
  { reactants: ['C55H106O3', 'O2'], products: ['CO2', 'H2O'] },
  { reactants: ['KNO3', 'C', 'S'], products: ['K2S', 'CO2', 'N2'] },
  { reactants: ['NH4ClO4'], products: ['N2', 'H2O', 'HCl', 'O2'] },
  { reactants: ['C3H5N3O9'], products: ['CO2', 'H2O', 'N2', 'O2'] },
  { reactants: ['Al4C3', 'H2O'], products: ['CH4', 'Al(OH)3'] },
  { reactants: ['Al', 'MnO2'], products: ['Mn', 'Al2O3'] },
  { reactants: ['C12H22O11', 'O2'], products: ['CO2', 'H2O'] },
  { reactants: ['PBr5', 'H2O'], products: ['H3PO4', 'HBr'] },
  { reactants: ['C8H18', 'O2'], products: ['CO2', 'H2O'] },
  { reactants: ['NO2', 'H2O'], products: ['HNO3', 'NO'] },
  { reactants: ['H3PO3'], products: ['H3PO4', 'PH3'] },
  { reactants: ['CN2H6', 'N2O4'], products: ['N2', 'H2O', 'CO2'] },
  { reactants: ['C7H5N3O6', 'O2'], products: ['CO2', 'H2O', 'N2'] },
  { reactants: ['C11H24', 'O2'], products: ['CO2', 'H2O'] },
  {
    reactants: ['K2Cr2O7', 'C2H5OH', 'H2SO4'],
    products: ['K2SO4', 'Cr2(SO4)3', 'CO2', 'H2O'],
  },
  { reactants: ['P', 'HNO3', 'H2O'], products: ['H3PO4', 'NO'] },
  { reactants: ['HPO3', 'C'], products: ['H2O', 'CO', 'P'] },
  { reactants: ['SF6', 'H2S'], products: ['S', 'HF'] },
  { reactants: ['KI', 'KIO3', 'HCl'], products: ['I2', 'KCl', 'H2O'] },
  { reactants: ['Fe2O3', 'HCl'], products: ['FeCl3', 'H2O'] },
  { reactants: ['MnO2', 'HCl'], products: ['MnCl2', 'Cl2', 'H2O'] },
  { reactants: ['Al', 'Fe3O4'], products: ['Al2O3', 'Fe'] },
  { reactants: ['C6H12O6'], products: ['C2H5OH', 'CO2'] },
  { reactants: ['CH4', 'O2'], products: ['CO2', 'H2O'] },
  { reactants: ['HNO3', 'HI'], products: ['H2O', 'I2', 'NO'] },
  { reactants: ['FeCl3', 'MgO'], products: ['Fe2O3', 'MgCl2'] },
  { reactants: ['C5H11NH2', 'O2'], products: ['CO2', 'H2O', 'NO2'] },
  { reactants: ['NH3', 'N2O'], products: ['N2', 'H2O'] },
  { reactants: ['NH4NO3'], products: ['N2', 'O2', 'H2O'] },
  { reactants: ['N2O', 'CH4'], products: ['N2', 'CO2', 'H2O'] },
  { reactants: ['N2H4', 'N2O4'], products: ['N2', 'H2O'] },
  { reactants: ['KMnO4'], products: ['K2O', 'MnO', 'O2'] },
  { reactants: ['C6H6', 'H2O2'], products: ['CO2', 'H2O'] },
  { reactants: ['CH3CCl3', 'O2'], products: ['CO2', 'H2O', 'Cl2'] },
  { reactants: ['HClO4', 'P4O10'], products: ['H3PO4', 'Cl2O7'] },
  { reactants: ['C4H10S', 'O2'], products: ['CO2', 'H2O', 'SO2'] },
  { reactants: ['CO', 'H2'], products: ['C8H18', 'H2O'] },
  { reactants: ['FeS', 'O2'], products: ['Fe2O3', 'SO2'] },
  { reactants: ['FeS', 'O2'], products: ['Fe2O3', 'SO3'] },
  { reactants: ['As', 'NaOH'], products: ['Na3AsO3', 'H2'] },
  { reactants: ['C8H18', 'O2'], products: ['CO', 'H2O'] },
  {
    reactants: ['FeSO4', 'K2Cr2O7', 'H2SO4'],
    products: ['Fe2(SO4)3', 'K2SO4', 'Cr2(SO4)3', 'H2O'],
  },
  { reactants: ['Cr2O3', 'PbO2', 'KOH'], products: ['K2CrO4', 'PbO', 'H2O'] },
  {
    reactants: ['KNO2', 'KMnO4', 'H2SO4'],
    products: ['KNO3', 'MnSO4', 'K2SO4', 'H2O'],
  },
  {
    reactants: ['K3CrO3', 'KMnO4', 'H2O'],
    products: ['K2CrO4', 'MnO2', 'KOH'],
  },
  {
    reactants: ['FeSO4', 'KMnO4', 'H2SO4'],
    products: ['Fe2(SO4)3', 'K2SO4', 'MnSO4', 'H2O'],
  },
  {
    reactants: ['KIO3', 'FeCl2', 'HCl'],
    products: ['FeCl3', 'I2', 'KCl', 'H2O'],
  },
];
