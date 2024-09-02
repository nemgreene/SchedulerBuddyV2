import React, { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { DateSlice } from "@/lib/features/dates/DateSlice";
import {
  Phenome,
  TimelineData,
  DayInterface,
  KeyInterface,
  OutputBlock,
  OutputInterface,
} from "../utilities/interfaces";
import {
  intializePopulation,
  structureData,
  mutationFunction,
  timelineStructuredData,
  populationSize,
  fitnessFunction,
  crossoverFunction,
  constructFiltered,
} from "./utilities";
import ComputationDisplayTable from "./ComputationDisplayTable";
import { Button } from "@mui/material";
// import { setStorePhenome } from "../lib/features/PhenomeSlice";
import {
  PhenomeSlice,
  setStorePhenome,
} from "@/lib/features/phenome/phenomeSlice";
import moment from "moment";

export default function ComputationDash() {
  const dispatch = useAppDispatch();

  const {
    dates: { data, snapIncrement, timeSlots },
    phenome: { phenome },
  } = useAppSelector((v: { dates: DateSlice; phenome: PhenomeSlice }) => {
    return { phenome: v.phenome, dates: v.dates };
  }, shallowEqual);

  const [filterKey, setFilterKey] = useState<KeyInterface>("allocations");

  const structuredData: OutputBlock = structureData(data);
  const timelineData: TimelineData = timelineStructuredData(
    structuredData,
    snapIncrement,
    timeSlots
  );

  const population = [...intializePopulation(timelineData)];
  var config = {
    mutationFunction: (v: Phenome) => mutationFunction(v, timelineData),
    crossoverFunction: (a: Phenome, b: Phenome) =>
      crossoverFunction(a, b, timelineData),
    fitnessFunction: (v: Phenome) => {
      const fitness = fitnessFunction(v);
      return fitness;
    },
    // doesABeatBFunction: (a, b) => {
    // },
    // population: () => [...intializePopulation(timelineData)],
    population,
    populationSize: populationSize, // defaults to 10
  };
  var GeneticAlgorithmConstructor = require("geneticalgorithm");
  var geneticalgorithm = GeneticAlgorithmConstructor(config);

  const handleEvolve = () => {
    const start = moment();
    for (let i = 0; i < 100; i++) {
      geneticalgorithm.evolve();
    }
    const end = moment();
    console.log(
      "Execution of 100 generations in: ",
      end.diff(start, "seconds", true),
      " seconds"
    );
    const result = constructFiltered(geneticalgorithm.best(), filterKey);
    dispatch(
      setStorePhenome({
        phenome: result,
      })
    );
  };

  const updateFilter = (key: KeyInterface) => {
    dispatch(
      setStorePhenome({
        phenome: constructFiltered(geneticalgorithm.best(), key),
      })
    );
  };

  return (
    <div>
      <Button onClick={() => handleEvolve()}>Click</Button>
      <ComputationDisplayTable
        phenome={phenome}
        updateFilter={updateFilter}
        filterKey={filterKey}
        setFilterKey={setFilterKey}
      />
    </div>
  );
}
