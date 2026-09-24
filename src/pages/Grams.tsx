import { FormGroup, InputGroup } from '@blueprintjs/core';
import type { ReactElement } from 'react';
import { useId, useMemo, useState } from 'react';
import { formatDecimal } from 'react-cheminfo/core';
import { ClickToCopy } from 'react-cheminfo/ui';

import { massComposition } from '../chemistry/composition.ts';
import { compoundName } from '../data/names.ts';
import { parseNumber } from '../exercises/answers.ts';
import { CalculatorTable } from '../shared/CalculatorTable.tsx';
import { ExerciseSeries } from '../shared/ExerciseSeries.tsx';
import { FormulaInput } from '../shared/FormulaInput.tsx';
import { FormulaProblem } from '../shared/FormulaProblem.tsx';
import { QuestionCompound } from '../shared/QuestionCompound.tsx';
import { QuestionFormula } from '../shared/QuestionFormula.tsx';
import { ToolPage } from '../shared/ToolPage.tsx';
import { GRAMS_TOOL } from '../tools/grams.ts';

/**
 * Work out the mass of every element in a sample of a compound.
 * @returns The page.
 */
export function Grams(): ReactElement {
  return (
    <ToolPage
      title="Mass of each element in a sample"
      lead="An element makes up the same share of any sample of a compound: its [[mass percent]]. Take that share of the sample's mass."
      playground={<SampleCalculator />}
      exercises={
        <ExerciseSeries
          tab="grams"
          tool={GRAMS_TOOL}
          label={(sample) => (
            <>
              {sample.grams} g <QuestionFormula formula={sample.formula} />
            </>
          )}
          prompt={(sample) => (
            <>
              <QuestionCompound
                formula={sample.formula}
                name={compoundName('samples', sample.formula)}
              />
              <p>
                How many grams of each element does a {sample.grams} g sample
                hold?
              </p>
            </>
          )}
        />
      }
    />
  );
}

function SampleCalculator(): ReactElement {
  const [formula, setFormula] = useState('Al2O3');
  const [grams, setGrams] = useState('20');
  const id = useId();
  const mass = parseNumber(grams);
  const result = useMemo(() => {
    try {
      return { composition: massComposition(formula), error: null };
    } catch (error) {
      return { composition: null, error };
    }
  }, [formula]);

  return (
    <div className="calculator">
      <div className="calculator__sides">
        <FormulaInput
          label="Formula"
          value={formula}
          onChange={setFormula}
          placeholder="e.g. Fe2O3"
        />
        <FormGroup label="Mass of the sample (g)" labelFor={id}>
          <InputGroup
            id={id}
            value={grams}
            onValueChange={setGrams}
            inputMode="decimal"
            autoComplete="off"
          />
        </FormGroup>
      </div>
      {result.composition === null ? (
        <FormulaProblem error={result.error} />
      ) : (
        <CalculatorTable headers={['Element', 'Mass %', 'In the sample (g)']}>
          {result.composition.elements.map((element) => (
            <tr key={element.symbol}>
              <td>{element.symbol}</td>
              <td>{formatDecimal(element.percent, 2)}</td>
              <ClickToCopy
                as="td"
                label={`mass of ${element.symbol}`}
                disabled={mass === null}
                value={
                  mass === null
                    ? ''
                    : formatDecimal((element.percent / 100) * mass, 4)
                }
              >
                {mass === null
                  ? '—'
                  : formatDecimal((element.percent / 100) * mass, 4)}
              </ClickToCopy>
            </tr>
          ))}
        </CalculatorTable>
      )}
    </div>
  );
}
