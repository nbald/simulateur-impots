import React, { Fragment, useEffect, useRef } from "react";
import styled from "styled-components";

import { prettyNumber } from "./numeral";
import { style } from "./style";

import { Spacer, SourceImpots, NAN_REVENUES } from "./DisplayComponents";

const BlockMore = styled.div`
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
    margin-top: 39px;
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
    font-weight: bold;
    text-transform: uppercase;
  }

  &&:last-child {
    align-items: center;
    color: ${(props) => props.theme.color};
  }
`;

const Graph = styled.div`
  height: 300px;
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
`;

const BlockLess = styled.div`
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

const StyledDescription = styled.div`
  max-width: 730px;
  background-color: #f4f4f4;
  padding: 16px;
`;

const StyledTitle = styled.div`
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

export const MoreHeritageResults = ({
  currentHeritage,
  currentTaxes,
  nextHeritage,
  nextTaxes,
  maxedOutTaxes,
}) => {
  const refAmountBlock = useRef(null);

  useEffect(() => {
    if (!refAmountBlock || !refAmountBlock.current) {
      return;
    }
    const percentWin = (currentTaxes - nextTaxes) / currentTaxes;
    const pixelsWin = percentWin * 200;
    refAmountBlock.current.style.height = `${pixelsWin}px`;
  }, [currentTaxes, nextTaxes, refAmountBlock]);

  return (
    <BlockMore>
      <ResultsGraph>
        <Graph>
          <GraphGrid>
            {[1, 1, 1, 1, 1, 1].map((v, i) => (
              <div key={i} />
            ))}
          </GraphGrid>
          <BlockGraph>
            <span>
              <span>votre impot actuel</span>
              <br />
              <strong>{prettyNumber(currentTaxes)}&nbsp;€</strong>
            </span>
            <BlockAmount />
          </BlockGraph>
          <BlockGraph>
            <span>
              <span>avec mélenchon</span>
              <br />
              <strong>{prettyNumber(nextTaxes)}&nbsp;€</strong>
            </span>
            <BlockAmountAnimated>
              <div ref={refAmountBlock} />
              <div />
            </BlockAmountAnimated>
          </BlockGraph>
        </Graph>
        <SourceImpots />
      </ResultsGraph>
      <ResultsText>
        <span>Si Jean-Luc Mélenchon est élu,</span>
        <ResultsNumber>
          Vos héritiers toucheront un héritage de {prettyNumber(nextHeritage)}
          &nbsp;€&nbsp;: {prettyNumber(nextHeritage - currentHeritage)}
          &nbsp;€ de plus que dans la situation actuelle.
        </ResultsNumber>
      </ResultsText>
    </BlockMore>
  );
};

export const LessHeritageResults = ({
  currentHeritage,
  currentTaxes,
  nextHeritage,
  nextTaxes,
  maxedOutTaxes,
}) => {
  const bigHeritage =
    isNaN(nextHeritage) ||
    isNaN(currentHeritage) ||
    currentHeritage > 1_000_000_000_000_000 ||
    nextHeritage > 1_000_000_000_000_000;

  return (
    <BlockLess>
      <Spacer size="16px" />
      {nextTaxes === 0 && currentTaxes === 0 ? (
        <StyledTitle>
          <strong>
            Votre patrimoine n'est pas soumis à des droits de succession
          </strong>
        </StyledTitle>
      ) : (
        <StyledTitle>
          Vos héritiers toucheront un héritage de{" "}
          {bigHeritage ? (
            NAN_REVENUES
          ) : (
            <Fragment>
              {prettyNumber(nextHeritage)}&nbsp;€&nbsp;:{" "}
              {prettyNumber(currentHeritage - nextHeritage)}
              &nbsp;€
            </Fragment>
          )}{" "}
          de moins que dans la situation actuelle.
          <br />
          Le reste contribuera à la solidarité nationale.
        </StyledTitle>
      )}
      <Spacer size="20px" />
      {nextTaxes === 0 && currentTaxes === 0 ? (
        <StyledDescription>
          Avec la Révolution Fiscale, l’impôt sur le patrimoine baissera ou
          n’augmentera pas pour 90&nbsp;% des contribuables.
        </StyledDescription>
      ) : maxedOutTaxes ? (
        <StyledDescription>
          L’héritage maximum est plafonné à 12 millions d'euros par personne,
          soit 8&nbsp;siècles de SMIC actuel. Les sommes au-delà permettront
          notamment de financer{" "}
          <strong>une garantie d'autonomie de 1063&nbsp;€</strong> pour tous les
          jeunes détachés du foyer fiscal parental.
        </StyledDescription>
      ) : (
        <StyledDescription>
          Ce paiement pourra être étalé sur plusieurs années. Votre contribution
          permettra notamment de financer{" "}
          <strong>une garantie d'autonomie de 1063€</strong> pour les jeunes
          détachés du foyer fiscal parental.
        </StyledDescription>
      )}
      <SourceImpots />
    </BlockLess>
  );
};

const HeritageResults = (props) =>
  props.nextHeritage <= props.currentHeritage ? (
    <LessHeritageResults {...props} />
  ) : (
    <MoreHeritageResults {...props} />
  );

export default HeritageResults;
