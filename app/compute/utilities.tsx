import {
  AllocationBlockInterface,
  AllocationInterface,
  DayInterface,
  KeyInterface,
  MartrixChildInterface,
  MatrixInterface,
  MatrixKeys,
  OutputBlock,
  OutputInterface,
  Phenome,
  PhenomeBlock,
  TimelineData,
} from "../utilities/interfaces";
import dummyData from "../utilities/DummyDataTesting02.json";
import { Box, Grid } from "@mui/material";
import DayContainer from "../timetable/DayContainer";
import React, { ReactNode } from "react";
import DayAperture from "../timetable/DayAperture";
import DayCard from "../timetable/DayCard";
import { phenomeSlice } from "@/lib/features/phenome/phenomeSlice";

var moment = require("moment"); // require
export const populationSize = 100;
export const params = {
  blockMutationPercentage: 0.3, //Used in the mutation function, this represents the percentage of mutated PhenomeBlocks
  populationSize,
  crossoverMutationPercentage: 0.3, //Used in the mutation function, this represents the percentage of mutated PhenomeBlocks
  matrixScoring: {
    "I+": 2,
    "I-": 0,
    "P+": 1.1,
    "P-": 0.5,
  },
};

/**
 * Verifies that date being operated on is a moment object
 * @param date
 * @returns Moment.moment
 */
export const __moment = (date: moment.Moment): moment.Moment => {
  return moment.isMoment(date) ? moment : moment(date, "HH:mm");
};

/**
 *
 * @param arr [] : Array to randomly choose from
 * @returns  random selection from array
 */
export const randomChoice = (arr: any[]) => {
  return arr[Math.floor(arr.length * Math.random())];
};

function randomNum(max: number = 10, count: number = 1): number[] {
  var n = [];
  for (var i = 0; i < 3; i++) {
    n.push(Math.floor(Math.random() * max));
  }
  return n;
}

export const printer = (obj: { [key: string]: {} }) => {
  Object.keys(obj).map((v) => {
    return;
    // console.log(`${v} : ${obj[v]}\n`);
  });
};

/**
 * Iterator utility to tally the score used in assessing phenome fitness
 * Because of the computational complexity of some of the metrics, this funciton optimizes the fitness heuristic by breaking if any return a value of 0
 *
 * If none of the hursitics equal 0, they will be multiplied and the total returned
 * @param executables
 * @returns
 */
export const assesors = (
  executables: Function[],
  operation: "+" | "*" = "*"
) => {
  try {
    let score = 1;

    executables.forEach((v) => {
      let execution = v();
      if (execution <= 0) {
        throw Error;
      }
      if (operation === "*") {
        score *= execution;
      }
      if (operation === "+") {
        score += execution;
      }
    });
    return score;
  } catch (e) {
    return 0;
  }
};

export const cloneJSON = (item: {}) => {
  return JSON.parse(JSON.stringify(item));
};

/**
 * Verify that the child time range is inside the parent time range
 * @param parentStart  Start of parent time range
 * @param childStart  Start of child time range
 * @param childEnd  End of child time range
 * @param parentEnd  End of child time range
 * @returns {Bool} Returns True if:
 *  Child start is later then/equal to parent start
 *  Child start !== Child End
 *  Child end is later then/equal to parent end
 *
 * else
 *
 */
export const dateRangeValid = (
  parentStart: moment.Moment | string,
  childStart: moment.Moment | string,
  childEnd: moment.Moment | string,
  parentEnd: moment.Moment | string
) => {
  //verufy all args are in moment format
  const [ps, cs, ce, pe] = [parentStart, childStart, childEnd, parentEnd].map(
    (v) => (moment.isMoment(v) ? v : moment(v, "HH:mm"))
  );

  return ps.diff(cs) <= 0 && cs.diff(ce) < 0 && ce.diff(pe) <= 0;
};

/**
 *  Produces a random population to initialize the genetic algorithm
 *
 *  For each allocation, the function assigns a random asset and location
 * @param data Timeline data:
 * @returns Phenome[]
 */
export const intializePopulation = (data: TimelineData): Phenome[] => {
  // return data;
  // return [data, data];
  const populationZero: Phenome[] = [];
  new Array(params.populationSize).fill("").forEach((_) => {
    const ret: Phenome = {};
    Object.keys(data).forEach((key: string) => {
      let insert: PhenomeBlock[] = [];
      data[key].allocations?.forEach((allocation) => {
        //if ratio is less then [1:1] assign a random asset/location
        if (allocation.ratio && allocation.ratio[0] === 1) {
          insert = [
            ...insert,
            {
              allocations: cloneJSON(allocation),
              locations: randomChoice(data[key].locations),
              assets: randomChoice(data[key].assets),
            },
          ];
        } else {
          //if ratio > [1:1] insert multiple instances of allocation with the same location
          let locations = randomChoice(data[key].locations);
          insert = [
            ...insert,
            ...new Array(allocation.ratio ? allocation.ratio[0] : 0)
              .fill("")
              .map(() => ({
                allocations: cloneJSON(allocation),
                locations,
                assets: randomChoice(data[key].assets),
              })),
          ];
        }
      });
      if (insert.length > 0) {
        ret[key] = insert;
      }
    });
    populationZero.push(ret);
  });
  return populationZero;
};

export const structureData = (
  data: DayInterface | { [key: string]: [] }
): OutputBlock => {
  const ret: OutputBlock = { allocations: [], assets: [], locations: [] };
  Object.keys(data).forEach((v) => {
    ret[v as keyof OutputBlock] = data[v as keyof typeof data].reduce(
      (acc: any, { blocks, ...rest }) => {
        return [
          ...acc,
          ...(blocks?.reduce((acc: PhenomeBlock[], curr: any) => {
            return [
              ...acc,
              {
                ...rest,
                ...cloneJSON(curr),
              },
            ];
          }, []) || []),
        ];
      },
      []
    );
  });
  return ret;
};

/**
 * Some early "wins" can be found without a hollistic view of the timeteable:
 * 1- Must have asset and location, initialize base score as 10
 * 2- Assess matrix

 * @param block 
 * @returns number
*/
const __assessPhenomeBlock = (block: PhenomeBlock[]): number => {
  let fitness = 1;
  //These will be examined in the following loop
  //iterate over all allocations
  block.forEach((v: PhenomeBlock) => {
    fitness *= assesors([
      // Must have asset and location, initialize base score as 10
      () => assessHasLocationHasAsset(v),
      // Assess matrix
      () => assessPhenotypeMatrix(v),
    ]);
  });
  return fitness;
};

export const fitnessFunction = (phenotype: Phenome) => {
  let fitness = 1;
  // use phenotype and possibly some other information
  // to determine the fitness number.  Higher is better, lower is worse.
  //Iterate over all time slots
  try {
    Object.keys(phenotype).forEach((key) => {
      const block: PhenomeBlock[] = phenotype[key];

      fitness *= __assessPhenomeBlock(phenotype[key]);
      //check for unfit solution
      if (!(fitness > 0)) {
        throw new Error("Failed block wide tests");
      }
      //Next step examines holistic blockwide constraints that are more computationally demanding
      let capacity = assessPhenotypeCapacity(block);
      let ratio = assessPhenotypeRatio(block);
      fitness += assesors([() => capacity, () => ratio], "+");
    });
    return fitness;
  } catch (error) {
    return 0;
  }
};

/**
 *  Function responsible for the mutation of phenomes during the genetic algorithm.
 *
 * @param oldPhenotype Phenome[PhenomeBlocks[]] Old phenotype to undergo mutation
 * @param stateData State Data with the full list of allocations, assets, and locations
 * @param mutationThreshold {number} Percentage of PhenomeBlocks to mutate
 *
 *
 * @returns
 */
export const mutationFunction = (
  oldPhenotype: Phenome,
  timelineData: TimelineData = {}
) => {
  const ret = cloneJSON(oldPhenotype);
  //iterate over old phenotype
  Object.keys(oldPhenotype).forEach((timeStep: string) => {
    // Using fitness function to assess which aspects of the phenome block needs changing
    let capacity = assessPhenotypeCapacity(oldPhenotype[timeStep]);
    let ratio = assessPhenotypeRatio(oldPhenotype[timeStep]);

    ret[timeStep] = oldPhenotype[timeStep].map((v) => {
      var resultPhenotype: PhenomeBlock = cloneJSON({ ...v });
      if (capacity < 1) {
        // - Duplicate entries of allocations are not assigned to the same location
        // - Capacity of location is exceeded
        resultPhenotype.locations = randomChoice(
          timelineData[timeStep].locations
        );
      }
      if (ratio < 1) {
        // - Allocations are not assigned sufficient assets
        // - Assets are assigned more allocations then can be managed
        resultPhenotype.allocations = randomChoice(
          timelineData[timeStep].allocations
        );
      }

      return resultPhenotype;
    });
  });
  return ret;
};

/**
 * Function resposible for crossover in genetic algorithm. This function takes 2 phenomes, and will randomly switch a number of their elements
 * @param phenoTypeA : Phenome[]
 * @param phenoTypeB : Phenome[]
 * @param crossoverMutationPercentage : Crossover percentage. This percentage of elems will be swapped between the 2 Phenomes
 * @returns {Phenome, Phenome}
 */
export const crossoverFunction = (
  phenoTypeA: Phenome,
  phenoTypeB: Phenome,
  timelineData: TimelineData,
  crossoverMutationPercentage: number = params.crossoverMutationPercentage
) => {
  //iterate over old phenotype
  let [swap1, swap2] = [cloneJSON(phenoTypeA), cloneJSON(phenoTypeB)];

  //iterate over all timeline data to make sure no timeslot is missed
  Object.keys(timelineData).forEach((timeStep: string) => {
    //if phenotypes do not both have matching timesteps, ignore
    if (!phenoTypeA[timeStep] || !phenoTypeB[timeStep]) {
      return;
    } else {
      let iterator =
        phenoTypeA.length > phenoTypeB.length
          ? phenoTypeA[timeStep]
          : phenoTypeB[timeStep];
      randomNum(
        iterator.length,
        Math.floor(iterator.length * crossoverMutationPercentage)
      ).forEach((v) => {
        [swap1[timeStep][v], swap2[timeStep][v]] = [
          swap2[timeStep][v],
          swap1[timeStep][v],
        ];
      });
    }
  });
  return [swap1, swap2];
};

/**
 *  Evaluates Phenome Ratio
 * - Allocations are assigned sufficient assets
 * - Assets are not assigned more allocations then can be managed
 * @param phenome
 */
export const assessPhenotypeRatio = (phenome: PhenomeBlock[]): number => {
  const allocationNames: { name: string; ratio: number[] }[] = Array.from(
    new Set(
      phenome.map((v) => ({
        ratio: v.allocations.ratio!,
        name: v.allocations.name!,
      }))
    )
  );
  const assetsNames = Array.from(new Set(phenome.map((v) => v.assets.name)));

  return assesors([
    //Check that each allocation has the correct number of staff assigned re ratio[0]
    //Multiple blocks are introduced for an allocation with needs exceeding 1:1
    //Ensuring multiple assets are assigned is included
    ...allocationNames.map((v) => {
      return () => {
        let assetCount = Array.from(
          new Set(
            [...phenome].reduce(
              (acc: PhenomeBlock[], curr: any) =>
                curr.allocations.name === v.name
                  ? [...acc, curr.assets.name]
                  : acc,
              []
            )
          )
        );
        const ret =
          assetCount[0] && assetCount.length === v.ratio[0] ? 1.1 : 0.0;
        return ret;
      };
    }),
    //verify each asset is not allocated to more allocations then they can manage
    //total pool of allocations assigned to asset is collected, then lowest ratio is surveyed
    //if more allocations are assigned to an asset thenn respects the lowest ratio, raise a conflict:
    //[{child:1, ratio:[1,1]}, {child:2, ratio:[1,2]}] == invalid
    //[{child:1, ratio:[1,2]}, {child:2, ratio:[1,2]}] == valid
    //
    ...assetsNames.map((v) => {
      return () => {
        let assetCount = Array.from(
          new Set(
            [...phenome].reduce((acc: PhenomeBlock[], curr: any) => {
              return curr.assets.name === v ? [...acc, curr.allocations] : acc;
            }, [])
          )
        ).sort((a, b) => a?.ratio[1] - b?.ratio[1]);
        const ret = assetCount[0]?.ratio[1] < assetCount.length ? 0.0 : 1.1;
        return ret;
      };
    }),
  ]);
};

/**
 * Verify the phenome respects capacity of all locations
 * - Duplicate entries of allocations are assigned to the same location
 * - Capacity of location is not exceeded
 * @param phenome PhenomeBlock[]
 * @returns {number} score
 */
export const assessPhenotypeCapacity = (phenome: PhenomeBlock[]): number => {
  //verify that all allocations with an elevated ratio are assigned to the same location
  let duplicate: PhenomeBlock[] = [],
    unique: PhenomeBlock[] = [];

  // seperate allocations with duplicate names from unique names
  phenome.forEach((block, i, array) => {
    if (
      array.findIndex((v) => v.allocations.name === block.allocations.name) ===
      array.findLastIndex((v) => v.allocations.name === block.allocations.name)
    ) {
      unique.push(block);
    } else {
      duplicate.push(block);
    }
  });
  let score = assesors([
    () => {
      //Verify that each duplicate allocation entry from elevated ratio is assigned to the same location

      return Array.from(new Set(duplicate.map((v) => v.allocations.name)))
        .length ===
        Array.from(new Set(duplicate.map((v) => v.locations.name))).length
        ? 1.1
        : 0;
    },
    //Verify capacity in room is not exceeded
    () => {
      let score = assesors(
        Array.from(
          new Set(
            //get unique locations to iterate across
            phenome.map((v) =>
              JSON.stringify({
                name: v.locations.name,
                capacity: v.locations.capacity || 100,
              })
            )
          )
        )
          .map((v) => JSON.parse(v))
          .map(({ name: locationName, capacity }) => {
            //find all occupants
            const occupants = [
              //look at unique rooms
              ...unique,
              //and only look at duplciate rooms once
              ...duplicate.filter(
                (v, i, array) =>
                  array.findIndex(
                    (v) => v.allocations.name === v.allocations.name
                  ) === i
              ),
            ].reduce((acc, curr) => {
              //count how many allocations are assigned to this room including head count
              return curr.locations.name === locationName
                ? acc + 1 * (curr.allocations.headCount || 1)
                : acc;
            }, 0);
            return () => (capacity >= occupants ? 1.1 : 0);
          })
      );
      //
      return score;
    },
  ]);

  // const reducedPhenome =
  // return assesors([() => {}]);
  return score;
};

export const assessPhenotypeMatrix = ({
  allocations,
  locations,
  assets,
}: PhenomeBlock): number => {
  // check to see if phenotype has a viable solution re matrix
  // relationships need to be tracked across locations, allocations, and assets
  // allocation repects relations across locations/assets
  const allocationAssessment = assesors(
    Object.keys(allocations.matrix || {}).map((val: string) => {
      return () =>
        assesors(
          allocations.matrix[val as keyof MatrixInterface].map((v) => {
            return () =>
              v.id === locations.id || v.id === assets.id
                ? params.matrixScoring[val as keyof MatrixInterface]
                : 1;
          })
        );
    })
  );
  const locationAssessment = assesors(
    Object.keys(locations.matrix || {}).map((val) => {
      return () =>
        assesors(
          locations.matrix[val as keyof MatrixInterface].map((v) => {
            return () =>
              v.id === allocations.id || v.id === assets.id
                ? params.matrixScoring[val as keyof MatrixInterface]
                : 1;
          })
        );
    })
  );
  const assetAssessment = assesors(
    Object.keys(assets.matrix || {}).map((val) => {
      return () =>
        assesors(
          assets.matrix[val as keyof MatrixInterface].map(
            (v: MartrixChildInterface) => {
              return () =>
                v.id === allocations.id || v.id === locations.id
                  ? params.matrixScoring[val as keyof MatrixInterface]
                  : 1;
            }
          )
        );
    })
  );
  return assesors([
    () => allocationAssessment,
    () => locationAssessment,
    () => assetAssessment,
  ]);
};

/**
 *Flattens state data into a timetable format to allow time-relative comparisons
 * @param stateData Formatted state data for parsing
 * @param snapIncrement time increment present in store
 * @param timeSlots timeline constructed
 */
export const timelineStructuredData = (
  stateData: OutputBlock,
  snapIncrement: number,
  timeSlots: Array<moment.Moment & { _f?: string }> = []
): TimelineData => {
  const ret: TimelineData = {};
  const dict = ["allocations", "locations", "assets"];
  timeSlots.forEach((v) => {
    let timeBlockStart = v.format(v._f);
    let timeBlockFinish = moment(v).add(snapIncrement, "minutes").format(v._f);
    let insertObj: any = {};
    dict.forEach((key: KeyInterface) => {
      const insert = stateData[key as keyof OutputBlock]
        .filter((v) => {
          return dateRangeValid(
            v.timeStart,
            timeBlockStart,
            timeBlockFinish,
            v.timeEnd
          );
        })
        .map((v) => ({
          ...v,
          timeStart: timeBlockStart,
          timeEnd: timeBlockFinish,
        }));
      if (insert.length > 0) {
        insertObj[key] = insert;
      }
    });
    if (Object.keys(insertObj).length > 0) {
      ret[v.format(v._f) as keyof TimelineData] = insertObj;
    }
    // if (!(ret[v.format(v._f)]["allocations"].length > 0)) {
    // delete ret[v.format(v._f)];
    // }
  });
  return ret;
};

/**
 * Verifies that each block allocation has a location and asset assigned
 * @param block PhenomeBlock
 * @returns number
 */
export const assessHasLocationHasAsset = (block: PhenomeBlock) => {
  return !block.assets || !block.locations ? 0 : 1.1;
};

/**
 * Converts Phenome into a format to be parsed by the frontend
 * @param phenome {Phenome}
 * @param key {KeyInterface} Key to sort timelines by
 * @returns {OutputInterface}
 */ export const constructFiltered = (
  phenome: Phenome,
  key: KeyInterface
): {} | OutputInterface => {
  const keys: KeyInterface[] = ["assets", "allocations", "locations"];
  //flatten data into single array
  let timeSteps = Object.keys(phenome);
  const flat = timeSteps.reduce(
    (acc: PhenomeBlock[], curr: string) => [...acc, ...phenome[curr]],
    []
  );
  // .sort((a, b) => (a.name[key] > b.name ? 1 : -1));
  //get unique Assets/Allocations/Locations
  const uniqueKey = Array.from(
    new Set(flat.map((v) => v[key as keyof PhenomeBlock]?.name))
  ).filter((v) => v);
  //Construct dict for referencing, removing duplicates created by elevated ratio
  const ret: any = {};
  uniqueKey.forEach((v) => {
    let uniqueName: string = v!;
    ret[uniqueName] = {};

    keys.forEach((localKeyname) => {
      ret[uniqueName][localKeyname] = Array.from(
        new Set(
          flat
            .filter((v) => v[key as keyof PhenomeBlock]?.name === uniqueName)
            .map((v) =>
              JSON.stringify(v[localKeyname as keyof PhenomeBlock] || {})
            )
        )
      )
        .map((v) => {
          return Object.keys(v).length > 0 ? JSON.parse(v) : {};
        })
        //sort time blocks by name first to capture concurrency, then by time in groups
        .sort((a, b) => {
          if (a.name === b.name) {
            return moment(a.timeStart, "HH:mm").diff(
              moment(b.timeStart, "HH:mm")
            );
          }
          return a.name > b.name ? 1 : -1;
        })
        // //find concurrent time blocks and reduce down
        .reduce((acc, curr, _, array) => {
          if (JSON.stringify(curr) === "{}") {
            return acc;
          }
          const prev = { ...acc.slice(-1)[0] };
          const {
            timeStart: prevTimeStart,
            timeEnd: prevTimeEnd,
            ...prevRest
          } = prev;
          const {
            timeStart: currTimeStart,
            timeEnd: currTimeEnd,
            ...currRest
          } = curr;
          if (
            prev &&
            prevTimeEnd &&
            currTimeStart &&
            prevTimeEnd === currTimeStart &&
            JSON.stringify(prevRest) == JSON.stringify(currRest)
          ) {
            const ret = [
              ...acc.slice(0, -1),
              { ...prev, timeEnd: currTimeEnd },
            ];
            return ret;
          }
          return [...acc, curr];
        }, []);
    });
  });
  return ret;
};
