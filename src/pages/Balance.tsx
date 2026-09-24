import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { ClickToCopy } from 'react-cheminfo/ui';
import { MF } from 'react-mf';

import type { Reaction } from '../chemistry/balance.ts';
import {
  balanceReaction,
  sideTotals,
  splitSide,
} from '../chemistry/balance.ts';
import { normalizeFormula } from '../chemistry/formula.ts';
import { CalculatorTable } from '../shared/CalculatorTable.tsx';
import { ExerciseSeries } from '../shared/ExerciseSeries.tsx';
import { FormulaInput } from '../shared/FormulaInput.tsx';
import { FormulaProblem } from '../shared/FormulaProblem.tsx';
import { ToolPage } from '../shared/ToolPage.tsx';
import { BALANCE_TOOL, balancedEquation } from '../tools/balance.ts';

/**
 * Balance a chemical reaction.
 * @returns The page.
 */
export function Balance(): ReactElement {
  return (
    <ToolPage
      title="Balance a chemical reaction"
      lead="Atoms are neither made nor lost in a reaction: every element counts as many atoms on each side. The [[coefficient|coefficients]] say how many of each formula take part."
      playground={<BalanceCalculator />}
      exercises={
        <ExerciseSeries
          tab="balance"
          tool={BALANCE_TOOL}
          label={(reaction) => (
            <span className="reaction">
              <ReactionLine
                reaction={{ reactants: reaction.reactants, products: [] }}
              />
              <span className="reaction__sign">→ …</span>
            </span>
          )}
          prompt={(reaction) => (
            <>
              <p className="question-compound">
                <ClickToCopy
                  label="reaction"
                  value={`${reaction.reactants.join(' + ')} -> ${reaction.products.join(' + ')}`}
                >
                  <ReactionLine reaction={reaction} />
                </ClickToCopy>
              </p>
              <p>
                Give each species its coefficient, with the smallest whole
                numbers.
              </p>
            </>
          )}
        />
      }
    />
  );
}

/**
 * A reaction, its formulas drawn, and its coefficients when it has them.
 * @param props - The reaction, and optionally one coefficient per species.
 * @param props.reaction - The reaction.
 * @param props.coefficients - One per species, reactants first.
 * @returns The equation.
 */
function ReactionLine(props: {
  reaction: Reaction;
  coefficients?: readonly number[];
}): ReactElement {
  const { reaction, coefficients } = props;
  const species = [...reaction.reactants, ...reaction.products];
  const parts: ReactElement[] = [];
  for (const [index, formula] of species.entries()) {
    const coefficient = coefficients?.[index];
    const side = index < reaction.reactants.length ? 'left' : 'right';
    if (index > 0) {
      parts.push(
        <span key={`sign-${side}-${formula}`} className="reaction__sign">
          {index === reaction.reactants.length ? '→' : '+'}
        </span>,
      );
    }
    parts.push(
      <span key={`${side}-${formula}`} className="reaction__species">
        {coefficient === undefined || coefficient === 1 ? null : (
          <span className="reaction__coefficient">{coefficient}</span>
        )}
        <MF mf={normalizeFormula(formula)} />
      </span>,
    );
  }
  return <span className="reaction">{parts}</span>;
}

function BalanceCalculator(): ReactElement {
  const [left, setLeft] = useState('C8H18 + O2');
  const [right, setRight] = useState('CO2 + H2O');
  const result = useMemo(() => {
    const reaction = { reactants: splitSide(left), products: splitSide(right) };
    try {
      return { reaction, balance: balanceReaction(reaction), error: null };
    } catch (error) {
      return { reaction, balance: null, error };
    }
  }, [left, right]);

  return (
    <div className="calculator">
      <div className="calculator__sides">
        <FormulaInput
          label="Reactants"
          value={left}
          onChange={setLeft}
          placeholder="e.g. CH4 + O2"
          helper="Separate the formulas with +."
        />
        <FormulaInput
          label="Products"
          value={right}
          onChange={setRight}
          placeholder="e.g. CO2 + H2O"
          helper="A charge in parentheses: Fe(3+)."
        />
      </div>
      {result.balance === null ? (
        <FormulaProblem error={result.error} />
      ) : result.balance.ok ? (
        <BalancedView
          reaction={result.reaction}
          coefficients={result.balance.coefficients}
        />
      ) : (
        <FormulaProblem error={new Error(result.balance.message)} />
      )}
    </div>
  );
}

function BalancedView(props: {
  reaction: Reaction;
  coefficients: readonly number[];
}): ReactElement {
  const { reaction, coefficients } = props;
  const totals = sideTotals(reaction, coefficients);
  return (
    <>
      <p className="calculator__result">
        <ClickToCopy
          label="balanced reaction"
          value={balancedEquation(reaction, coefficients)}
        >
          <ReactionLine reaction={reaction} coefficients={coefficients} />
        </ClickToCopy>
      </p>
      <CalculatorTable headers={['Element', 'Left', 'Right']}>
        {totals.map((line) => (
          <tr key={line.label}>
            <td>{line.label === 'charge' ? 'Charge' : line.label}</td>
            <td>{line.left}</td>
            <td>{line.right}</td>
          </tr>
        ))}
      </CalculatorTable>
    </>
  );
}
