import React, { Fragment, useEffect, useRef } from "react";
import { prettyNumber } from "./numeral";

import styled from "styled-components";

import { Spacer, SourceImpots, NAN_REVENUES } from "./DisplayComponents";
import { style } from "./style.js";

const BlockLessImpots = styled.div`
  display: flex;
  padding-bottom: 14px;
  align-items: center;
  text-transform: uppercase;
  background-color: white;

  > div:last-child {
    color: white;
    padding-top: 10px;
  }

  @media (min-width: ${style.collapse}) {
    box-shadow: ${style.boxShadow};
    > div {
      width: 50%;
    }
  }

  @media (max-width: ${style.collapse}) {
    flex-direction: column-reverse;
    > div {
      width: 100%;
    }
  }
`;

const ResultsNumber = styled.div`
  background-color: ${(props) => props.theme.color};

  padding: 26px;
  width: 100%;
  line-height: 30px;
  font-size: 26px;

  span {
    font-size: 40px;
  }

  @media (max-width: ${style.collapse}) {
    align-items: center;
    text-align: center;

    > div {
      text-align: center;
      max-width: 360px;
      font-size: 19px;
      span {
        font-size: 24px;
      }
    }
  }
`;

const ResultsHelper = styled.div`
  text-transform: none;
  margin-top: 16px;
  font-weight: normal;
  &&& {
    color: #333;
  }

  @media (max-width: ${style.collapse}) {
    padding-left: 6px;
    padding-right: 6px;
  }
`;

const ResultsText = styled.div`
  font-weight: bold;
  font-family: ${style.fontSofia};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  > span {
    padding: 6px 12px;
    display: inline-block;
    background-color: ${style.blueLUP};
  }

  @media (max-width: ${style.collapse}) {
    align-items: center;
  }
`;

const ResultsGraph = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GraphGrid = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;

  div {
    height: 1px;
    width: 100%;
    background-color: #dfdfdf;
    margin-top: 49px;
  }
`;

const BlockAmount = styled.div`
  background-color: ${style.blueLUP};
`;

const BlockAmountAnimated = styled.div`
  display: flex;
  flex-direction: column;

  div {
    transition: 0.4s ease;
  }

  > div:first-child {
    background-color: ${(props) => props.theme.color};
    opacity: 0.2;
    height: 0px;
  }

  > div:last-child {
    background-color: ${(props) => props.theme.color};
    flex: 1;
  }
`;

const BlockFullAmountAnimated = styled.div`
  display: flex;
  flex-direction: column;

  div {
    transition: 0.4s ease;
  }

  > div:first-child {
    background-color: ${style.blueLight};
    // opacity: 0.2;
    height: 0px;
  }

  > div:last-child {
    background-color: ${style.blueLUP};
    flex: 1;
  }
`;

const BlockLessAmountAnimated = styled.div`
  display: flex;
  flex-direction: column;

  div {
    transition: 0.4s ease;
  }

  > div:first-child {
    background-color: ${style.roseLUP};
    // opacity: 0.2;
    height: 0px;
  }

  > div:last-child {
    background-color: ${style.roseDark};
    flex: 1;
  }
`;

const BlockGraph = styled.div`
  align-items: center;
  color: ${style.blueLUP};
  font-weight: normal;

  > span {
    text-align: center;
    font-size: 24px;
    line-height: 26px;
    margin-bottom: 16px;
    text-transform: none;
  }
  span > span {
    font-family: ${style.fontSofia};
    font-size: 15px;
    line-height: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  &&:last-child {
    align-items: center;
    color: ${(props) => props.theme.color};
  }
`;

const Graph = styled.div`
  // height: 300px;
  // width: 345px;
  margin-top: 50px;
  width: 100%;
  min-width: 320px;
  max-width: 390px;

  position: relative;
  font-weight: bold;
  isolation: isolate;
  display: flex;
  justify-content: space-around;

  > div {
    justify-content: flex-end;
    display: flex;
    flex-direction: column;
  }

  ${BlockAmount}, ${BlockAmountAnimated} {
    height: 200px;
    width: 100px;
    z-index: 2;
    position: relative;
  }

  ${BlockFullAmountAnimated}, ${BlockLessAmountAnimated} {
    height: 200px;
    width: 100px;
    z-index: 2;
    position: relative;
  }
`;

const BlockMoreImpots = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  box-shadow: ${style.boxShadow};
  padding-top: 40px;
  padding-bottom: 16px;
  padding-left: 10px;
  padding-right: 10px;

  > span:first-child {
    color: ${(props) => props.theme.color};
    text-transform: uppercase;
    font-weight: bold;
  }

  span,
  strong {
    text-align: center;
  }
`;

const StyledContribution = styled.div`
  max-width: 730px;
  background-color: #f4f4f4;
  padding: 16px;
`;

const StyledContributionTitle = styled.div`
  color: ${style.blueLUP};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  > strong {
    font-size: 28px;

    @media (max-width: ${style.collapse}) {
      font-size: 20px;
    }
  }
`;

const StyledDetails = styled.div`
  background-color: white;
  flex-direction: row;
  display: flex;
  box-shadow: ${style.boxShadow};

  @media (max-width: ${style.collapse}) {
    flex-direction: column;
  }

  > div {
    display: flex;
    width: 50%;
    padding: 24px;

    :first-child {
      border-right: 1px solid #dfdfdf;
    }

    @media (max-width: ${style.collapse}) {
      flex-direction: column;
      width: auto;

      :first-child {
        border-right: 0;
        border-bottom: 1px solid #dfdfdf;
      }
    }
  }
`;

const BlockDetails = styled.div`
  > span {
    text-transform: uppercase;

    @media (max-width: ${style.collapse}) {
      margin-left: 10px;
    }
  }
`;

const StyledTotal = styled.div`
  display: flex;
  flex-direction: column;
  color: ${style.blueLUP};
  ${({ isRevolution, theme }) => isRevolution && `color: ${theme.color};`}
`;

const StyledLabel = styled.div`
  width: fit-content;
  padding: 6px;
  color: white;
  font-weight: bold;
  background-color: ${style.blueLUP};
  ${({ isRevolution, theme }) =>
    isRevolution && `background-color: ${theme.color};`}
`;

const InlineBlock = styled.span`
  display: inline-block;
  color: ${style.colorDefault};
`;

const GraphText = styled.div`
  display: inline-flex;
  justify-content: space-evenly;
  width: 100%;
  align-items: center;
  font-family: ${style.fontSofia};
  font-weight: bold;
  font-size: 15px;
  margin-top: 8px;

  div {
    text-align: center;
  }
`;

const GraphTextDetail = styled.div`
  color: ${style.blueLUP};
  ${({ isRevolution }) => isRevolution && `color: ${style.roseLUP};`}

  > span {
    font-size: 14px;
  }

  > span:first-child {
    font-size: 16px;
  }

  > span span {
    color: ${style.blueLight};
    ${({ isRevolution }) => isRevolution && `color: ${style.roseDark};`}
  }
`;

const GraphContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-width: 320px;
  max-width: 390px;
`;

export const LessImpotsResults = ({ impots, isHeritage }) => {
  const refFullAmountBlock = useRef(null);
  const refLessAmountBlock = useRef(null);
  const refContainerLessAmount = useRef(null);

  const nextTotal = isHeritage ? impots.next : impots.revolution.total;
  const new_IR = impots.revolution?.IR;

  // Version of totals with no split IR / CSG
  // useEffect(() => {
  //   const HEIGHT = 200;

  //   let percentWin;
  //   if (isHeritage) {
  //     percentWin = (impots.current - impots.next) / impots.current;
  //   } else {
  //     percentWin = impots.gain / currentTotal || 0;
  //   }

  //   const pixelsWin = percentWin * HEIGHT;

  //   if (!impots || !refAmountBlock || !refAmountBlock.current) {
  //     return;
  //   }
  //   refAmountBlock.current.style.height = `${pixelsWin}px`;
  // }, [impots, refAmountBlock]);

  // Show animated proportions of totals with IR / CSG
  useEffect(() => {
    const HEIGHT = 200;

    if (
      !impots ||
      !refFullAmountBlock ||
      !refFullAmountBlock.current ||
      !refLessAmountBlock ||
      !refLessAmountBlock.current ||
      !refContainerLessAmount ||
      !refContainerLessAmount.current
    ) {
      return;
    }

    // FULL AMOUNT = IMPOT CURRENT
    const percentIR = impots.current.IR / impots.current.total || 0;
    const pixelsIR = percentIR * HEIGHT;
    refFullAmountBlock.current.style.height = `${pixelsIR}px`;

    // LESS AMOUNT = IMPOT AFTER JLM
    // Set blocks css to 0 pixels ? or init 100 pixels each (animation direction)
    const HEIGHT_JLM = HEIGHT - (impots.gain / impots.current.total) * HEIGHT;
    refContainerLessAmount.current.style.height = `${HEIGHT_JLM}px`;

    const percentIR_JLM = impots.revolution.IR / impots.revolution.total || 0;
    const pixelsIR_JLM = percentIR_JLM * HEIGHT_JLM;
    refLessAmountBlock.current.style.height = `${pixelsIR_JLM}px`;
  }, [impots, refFullAmountBlock, refLessAmountBlock]);

  return (
    <BlockLessImpots>
      <ResultsGraph>
        <GraphContainer>
          <Graph>
            <GraphGrid>
              {[1, 1, 1, 1, 1].map((v, i) => (
                <div key={i} />
              ))}
            </GraphGrid>

            <BlockGraph>
              <BlockFullAmountAnimated>
                <div ref={refFullAmountBlock} />
                <div />
              </BlockFullAmountAnimated>
            </BlockGraph>

            <BlockGraph>
              <BlockLessAmountAnimated ref={refContainerLessAmount}>
                <div ref={refLessAmountBlock} />
                <div />
              </BlockLessAmountAnimated>
            </BlockGraph>
          </Graph>
          <GraphText>
            <GraphTextDetail>
              <span style={{ color: style.colorDefault }}>Impôts actuels</span>
              <br />
              <span>
                <span>Revenu</span> + CSG
              </span>
            </GraphTextDetail>
            <GraphTextDetail isRevolution style={{ paddingLeft: "40px" }}>
              <span style={{ color: style.colorDefault }}>Avec Mélenchon</span>
              <br />
              <span>
                Revenu + <span>CSG</span>
              </span>
            </GraphTextDetail>
          </GraphText>
        </GraphContainer>

        <SourceImpots />
      </ResultsGraph>

      <ResultsText>
        <span>Si Jean-Luc Mélenchon est élu,</span>
        <ResultsNumber>
          {!isHeritage && nextTotal < 0 ? (
            <div style={{ textTransform: "none" }}>
              Vous ne payerez plus d’impôt sur le revenu. L'État vous versera{" "}
              {prettyNumber(-new_IR)}&nbsp;€, pour un gain net de{" "}
              {prettyNumber(impots.gain)}&nbsp;€.
            </div>
          ) : (
            <Fragment>
              {isHeritage ? (
                <Fragment>
                  Vos héritiers gagneront{" "}
                  {prettyNumber(impots.current - impots.next)}&nbsp;€ sur leur
                  héritage
                </Fragment>
              ) : (
                <Fragment>
                  Vous gagnerez
                  <br />
                  <span>{prettyNumber(impots.gain)}&nbsp;€ par an</span>
                </Fragment>
              )}
            </Fragment>
          )}
        </ResultsNumber>

        {!isHeritage && nextTotal < 0 && (
          <ResultsHelper>
            <strong>Aujourd’hui</strong>, l'impôt sur le revenu payé diminue en
            fonction du nombre d'enfants. Ce{" "}
            <strong>système est injuste</strong>&nbsp;: les personnes non
            imposables ne gagnent rien, tandis que les plus riches gagnent
            beaucoup.
            <Spacer size="10px" />
            <strong>Avec la révolution fiscale</strong>, les familles toucheront
            toutes la même somme d'argent par enfant, quels que soient leurs
            revenus
          </ResultsHelper>
        )}
      </ResultsText>
    </BlockLessImpots>
  );
};

export const MoreImpotsResults = ({ impots, isHeritage, formData }) => {
  const gain = isHeritage ? impots.next - impots.current : impots.gain;
  const isCouple = formData ? !formData.isSingle : false;
  const sumRevenues = formData?.salary + (isCouple ? formData?.mateSalary : 0);

  const isEnormousRevenues = sumRevenues > 9_000_000_000_000_000;

  return (
    <BlockMoreImpots>
      {!isHeritage && !isCouple && (
        <span>
          votre revenu appartient aux {impots.percentile}% les plus élevés
        </span>
      )}
      <StyledContributionTitle>
        <Spacer size="16px" />

        {isHeritage ? (
          <Fragment>
            {impots.next === 0 && impots.current === 0 ? (
              <Fragment>
                <strong>
                  Votre patrimoine n'est pas soumis à des droits de succession
                </strong>
              </Fragment>
            ) : (
              <Fragment>
                <span>Vous contribuerez à hauteur de</span>
                <strong>
                  {isNaN(gain) || isEnormousRevenues
                    ? NAN_REVENUES
                    : `${prettyNumber(Math.abs(gain))}€ en + pour la
                  solidarité&nbsp;nationale`}
                </strong>
              </Fragment>
            )}
          </Fragment>
        ) : (
          <Fragment>
            <span>Vous contribuerez</span>
            {isNaN(gain) || isEnormousRevenues ? (
              NAN_REVENUES
            ) : (
              <Fragment>
                <strong>
                  {prettyNumber(Math.abs(gain / 12))}&nbsp;€ de plus par mois
                </strong>
                soit&nbsp;
                {Math.round((Math.abs(gain / 12) / sumRevenues) * 10_000) / 100}
                % de plus sur votre revenu
              </Fragment>
            )}
          </Fragment>
        )}
      </StyledContributionTitle>

      <Spacer size="20px" />
      <StyledContribution>
        {isHeritage ? (
          impots.next === 0 && impots.current === 0 ? (
            <Fragment>
              Avec la Révolution Fiscale, l’impôt sur le patrimoine baissera ou
              n’augmentera pas pour 90&nbsp;% des contribuables.
            </Fragment>
          ) : impots.maxedOutTaxes ? (
            <Fragment>
              L’héritage maximum est plafonné à 12 millions d'euros par
              personne, soit 8&nbsp;siècles de SMIC actuel. Les sommes au-delà
              permettront notamment de financer{" "}
              <strong>une garantie d'autonomie de 1063&nbsp;€</strong> pour tous
              les jeunes détachés du foyer fiscal parental.
            </Fragment>
          ) : (
            <Fragment>
              Ce paiement pourra être étalé sur plusieurs années. Votre
              contribution permettra notamment de financer{" "}
              <strong>une garantie d'autonomie de 1063€</strong> pour les jeunes
              détachés du foyer fiscal parental.
            </Fragment>
          )
        ) : (
          <Fragment>
            Votre contribution permettra de{" "}
            <strong>
              renforcer les moyens de nos hôpitaux, de nos écoles, de notre
              justice, de notre police
            </strong>{" "}
            et d’engager les investissements indispensables pour la{" "}
            <strong>bifurcation&nbsp;écologique</strong>.
          </Fragment>
        )}
      </StyledContribution>
      <SourceImpots />
    </BlockMoreImpots>
  );
};

const SquareColor = ({ color = style.blueLUP }) => (
  <div
    style={{
      display: "inline-block",
      width: "11px",
      height: "11px",
      backgroundColor: color,
      marginRight: "4px",
    }}
  />
);

const StyledPriceLine = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;

  color: ${style.blueLUP};
  ${({ isRevolution }) => isRevolution && `color: ${style.roseLUP};`}

  span {
    color: ${style.colorDefault};
  }

  > div:first-child {
    display: inline-flex;
    align-items: center;
  }

  > div:nth-child(2) {
    display: inline-flex;
    flex: 1;
    justify-content: end;
    white-space: nowrap;
    padding-left: 8px;
  }
`;

const StyledTotalPrice = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  font-weight: 700;
  justify-content: space-between;
`;

const PriceLine = ({ text, price, isRevolution, squareColor }) => (
  <StyledPriceLine isRevolution={isRevolution}>
    <div>
      {squareColor && <SquareColor color={squareColor} />} <span>{text}</span>
    </div>
    <div>{prettyNumber(price)} € / an</div>
  </StyledPriceLine>
);

const NewTotal = ({ impots, isRevolution }) => {
  const IR = isRevolution ? impots.revolution.IR : impots.current.IR;
  const CSG = isRevolution ? impots.revolution.CSG : impots.current.CSG;

  return (
    <StyledTotal isRevolution={isRevolution}>
      <StyledLabel isRevolution={isRevolution}>
        {isRevolution
          ? "Avec la révolution fiscale"
          : "Votre imposition actuelle"}
      </StyledLabel>

      <Spacer size="8px" />
      <PriceLine
        isRevolution={isRevolution}
        text="Impôt sur le revenu"
        price={IR}
        squareColor={isRevolution ? style.roseLUP : style.blueLight}
      />
      <Spacer size="8px" />
      <PriceLine
        isRevolution={isRevolution}
        text="CSG (contribution sociale généralisée)"
        price={CSG}
        squareColor={isRevolution ? style.roseDark : style.blueLUP}
      />
      <Spacer size="16px" />
      <StyledTotalPrice>
        <div>TOTAL</div>
        <div>{prettyNumber(IR + CSG)} € / an</div>
      </StyledTotalPrice>
    </StyledTotal>
  );
};

const TotalHeritage = ({ impots, isRevolution }) => {
  const imposition = isRevolution ? impots.nextTaxes : impots.currentTaxes;

  return (
    <StyledTotal isRevolution={isRevolution}>
      <StyledLabel isRevolution={isRevolution}>
        {isRevolution
          ? "Avec la révolution fiscale"
          : "Votre imposition actuelle"}
      </StyledLabel>
      <Spacer size="8px" />
      <strong>{prettyNumber(imposition)} €&nbsp;/ an</strong>
    </StyledTotal>
  );
};

export const Details = ({ impots, isHeritage }) => (
  <BlockDetails>
    {/* <span>Les chiffres en détails</span>
    <Spacer size="10px" /> */}
    {isHeritage ? (
      <StyledDetails>
        <TotalHeritage impots={impots} />
        <TotalHeritage impots={impots} isRevolution={true} />
      </StyledDetails>
    ) : (
      <StyledDetails>
        <NewTotal impots={impots} />
        <NewTotal impots={impots} isRevolution={true} />
      </StyledDetails>
    )}
  </BlockDetails>
);
