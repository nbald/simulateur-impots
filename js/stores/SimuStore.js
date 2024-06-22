import { ReduceStore } from "flux/utils";
import AppDispatcher from "../dispatcher/AppDispatcher";
import Constants from "./../constants/Constants";

import Simulation from "../data/simulation/Simulation";
import JLMSimulation from "../data/simulation/JLMSimulation";

import UserParams from "../data/simulation/UserParams";
import IRParams from "../data/simulation/IRParams";
import DistributionRevenus from "../data/DistributionRevenus";

// Catch: State must be immutable
class SimuStore extends ReduceStore {
  percentageRicher(net, couple) {
    const bareme = DistributionRevenus.bareme;
    let percentage = 0;
    for (const item of bareme) {
      if (net / (1 + couple) > item.revenu) {
        percentage = item.percentile;
      } else {
        break;
      }
    }
    return percentage;
  }

  // salaires = { person1: x, person2: x }
  generateSeries(salaires, _retraite, _chomage, couple, nbEnfants) {
    const simulation = Simulation(
      salaires.person1,
      salaires.person2,
      nbEnfants,
      couple
    );
    const jlmSimulation = JLMSimulation(
      salaires,
      couple,
      nbEnfants,
      simulation.salaireBrut
    );

    const IR = Math.round(simulation.impot.du.value * 12);
    const CSG = Math.round(simulation.csg.du.value * 12);
    let NEW_IR = Math.round(jlmSimulation.ir * 12);
    const CSG_P = Math.round(jlmSimulation.csg * 12);

    const gain = IR + CSG - (NEW_IR + CSG_P);
    if (gain < 0) {
      if (couple === 0) {
        if (
          nbEnfants > 0 &&
          salaires.person1 >= 2000 &&
          salaires.person1 <= 5000
        ) {
          var newSimulation = Simulation(
            salaires.person1,
            salaires.person2,
            0,
            0
          );
          const newSalaires = { person1: salaires.person1 };
          var newJLMSimulation = JLMSimulation(
            newSalaires,
            0,
            0,
            newSimulation.salaireBrut
          );
          var new_gain =
            12 * (newSimulation.impot.du.value + newSimulation.csg.du.value) -
            12 * (newJLMSimulation.ir + newJLMSimulation.csg);
          NEW_IR = -Math.round(new_gain - IR - CSG + CSG_P);
        }
      } else {
        const sommeSalaires = salaires.person1 + salaires.person2;
        const salaireMax = Math.max(salaires.person1, salaires.person2);
        const salaireMin = Math.min(salaires.person1, salaires.person2);
        const newSalaire = { person1: (salaireMin + salaireMax) / 2 };

        if ((nbEnfants == 0) & (salaireMax >= 1400)) {
          if (salaireMax <= 4000) {
            var newSimulation = Simulation(
              newSalaire.person1,
              newSalaire.person2,
              0,
              0
            );
            var newJLMSimulation = JLMSimulation(
              newSalaire,
              0,
              0,
              newSimulation.salaireBrut
            );
            var new_gain =
              12 * (newSimulation.impot.du.value + newSimulation.csg.du.value) -
              12 * (newJLMSimulation.ir + newJLMSimulation.csg);
            //if (new_gain > gain) {
            NEW_IR = -Math.round(new_gain / 2 - IR - CSG + CSG_P);
            //}
          } else if (salaireMax > 4000 && sommeSalaires <= 5500) {
            NEW_IR = Math.round(NEW_IR + gain);
          }
        } else if (nbEnfants > 0 && salaireMax >= 2200) {
          if (salaireMax <= 4000) {
            var newSimulation = Simulation(
              newSalaire.person1,
              newSalaire.person2,
              0,
              0
            );
            var newJLMSimulation = JLMSimulation(
              newSalaire,
              0,
              0,
              newSimulation.salaireBrut
            );
            var new_gain =
              12 * (newSimulation.impot.du.value + newSimulation.csg.du.value) -
              12 * (newJLMSimulation.ir + newJLMSimulation.csg);
            // (new_gain > gain) {
            NEW_IR = -Math.round(new_gain / 2 - IR - CSG + CSG_P);
            //}
          } else if (salaireMax > 4000 && sommeSalaires <= 5500) {
            NEW_IR = Math.round(NEW_IR + gain);
          }
        }
      }
    }

    return {
      current: {
        IR,
        CSG,
        total: IR + CSG,
      },
      revolution: {
        IR: NEW_IR,
        CSG: CSG_P,
        total: NEW_IR + CSG_P,
      },
      gain: IR + CSG - (NEW_IR + CSG_P),
      developer: jlmSimulation.calcul,
    };
  }

  getInitialState() {
    const net = 0;
    const retraite = 0;
    const chomage = 0;
    const couple = 0;
    const nbEnfants = 0;

    return {
      theme: Constants.Theme.DESIGNED,
      defaultNet: 1600,
      // defaultNet: 2800,
      net,
      retraite: 0,
      chomage: 0,
      percentile: this.percentageRicher(0, couple),
      isMarried: couple,
      numberOfChildren: nbEnfants,
      results: this.generateSeries(net, retraite, chomage, couple, nbEnfants),
    };
  }

  reduce(state, action) {
    switch (action.actionType) {
      case Constants.Action.NET_CHANGED:
        return {
          ...state,
          net: action.net,
          percentile: this.percentageRicher(action.net, state.isMarried),
          results: this.generateSeries(
            action.net,
            0,
            0,
            state.isMarried,
            state.numberOfChildren
          ),
        };

      case Constants.Action.RETRAITE_CHANGED:
        return {
          ...state,
          retraite: action.retraite,
          results: this.generateSeries(
            state.net,
            action.retraite,
            state.chomage,
            state.isMarried,
            state.numberOfChildren
          ),
        };

      case Constants.Action.CHOMAGE_CHANGED:
        return {
          ...state,
          chomage: action.chomage,
          results: this.generateSeries(
            state.net,
            state.retraite,
            action.chomage,
            state.isMarried,
            state.numberOfChildren
          ),
        };

      case Constants.Action.MARITAL_STATUS_CHANGED:
        return {
          ...state,
          isMarried: action.isMarried,
          percentile: this.percentageRicher(state.net, action.isMarried),
          results: this.generateSeries(
            state.net,
            state.retraite,
            state.chomage,
            action.isMarried,
            state.numberOfChildren
          ),
        };

      case Constants.Action.NUMBER_OF_CHILDREN_CHANGED:
        return {
          ...state,
          numberOfChildren: action.numberOfChildren,
          results: this.generateSeries(
            state.net,
            state.retraite,
            state.chomage,
            state.isMarried,
            action.numberOfChildren
          ),
        };

      case Constants.Action.THEME_CHANGED:
        return {
          theme: action.theme,
          ...state,
        };

      default:
        return state;
    }
  }
}

export default new SimuStore(AppDispatcher);
