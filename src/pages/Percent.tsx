import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { formatDecimal } from 'react-cheminfo/core';
import { ClickToCopy } from 'react-cheminfo/ui';

import { massComposition } from '../chemistry/composition.ts';
import { compoundName } from '../data/names.ts';
import { CalculatorTable } from '../shared/CalculatorTable.tsx';
import { CopyableFormula } from '../shared/CopyableFormula.tsx';
import { ExerciseSeries } from '../shared/ExerciseSeries.tsx';
import { FormulaInput } from '../shared/FormulaInput.tsx';
import { FormulaProblem } from '../shared/FormulaProblem.tsx';
import { QuestionCompound } from '../shared/QuestionCompound.tsx';
import { QuestionFormula } from '../shared/QuestionFormula.tsx';
import { ToolPage } from '../shared/ToolPage.tsx';
import { PERCENT_TOOL } from '../tools/percent.ts';

/**
 * Work out the mass percent of every element of a compound.
 * @returns The page.
 */
export function Percent(): ReactElement {
  return (
    <ToolPage
      title="Mass percent composition"
      lead="Each element of a compound brings its atoms' mass to one mole of it. Its [[mass percent]] is that mass divided by the [[molar mass]]."
      playground={<CompositionCalculator />}
      exercises={
        <ExerciseSeries
          tab="percent"
          tool={PERCENT_TOOL}
          label={(formula) => <QuestionFormula formula={formula} />}
          prompt={(formula) => (
            <>
              <QuestionCompound
                formula={formula}
                name={compoundName('percent', formula)}
              />
              <p>What is the mass percent of each of its elements?</p>
            </>
          )}
        />
      }
    />
  );
}

function CompositionCalculator(): ReactElement {
  const [formula, setFormula] = useState('C9H8O4');
  const result = useMemo(() => {
    try {
      return { composition: massComposition(formula), error: null };
    } catch (error) {
      return { composition: null, error };
    }
  }, [formula]);

  return (
    <div className="calculator">
      <FormulaInput
        label="Formula"
        value={formula}
        onChange={setFormula}
        placeholder="e.g. CaCO3, CuSO4.5H2O"
        helper="A hydrate with a dot: CuSO4.5H2O."
      />
      {result.composition === null ? (
        <FormulaProblem error={result.error} />
      ) : (
        <CalculatorTable
          headers={[
            'Element',
            'Atoms',
            'Atomic mass (g/mol)',
            'Mass (g/mol)',
            'Mass %',
          ]}
          footer={
            <tr className="calculator__total">
              <th colSpan={3}>
                Molar mass of <CopyableFormula formula={formula} />
              </th>
              <ClickToCopy
                as="td"
                label="molar mass"
                value={formatDecimal(result.composition.molarMass, 3)}
              >
                {formatDecimal(result.composition.molarMass, 3)}
              </ClickToCopy>
              <td>100</td>
            </tr>
          }
        >
          {result.composition.elements.map((element) => (
            <tr key={element.symbol}>
              <td>{element.symbol}</td>
              <td>{element.count}</td>
              <td>{formatDecimal(element.atomicMass, 3)}</td>
              <td>{formatDecimal(element.mass, 3)}</td>
              <ClickToCopy
                as="td"
                label={`mass percent of ${element.symbol}`}
                value={formatDecimal(element.percent, 2)}
              >
                {formatDecimal(element.percent, 2)}
              </ClickToCopy>
            </tr>
          ))}
        </CalculatorTable>
      )}
    </div>
  );
}
