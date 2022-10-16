import "@fontsource/roboto"; 
import { calculateHeading } from "./heading";
import './style.css'


class InputState {
  private domElement: HTMLInputElement
  private value: number | undefined
  
  private listeners: ((val: number | undefined) => void)[] = []

  public addListener(cb: (val: number | undefined) => void) {
    this.listeners.push(cb);
  }

  public getValue() {
    return this.value;
  }

  private setValidityState(isValid: boolean) {
    if (isValid) {
      this.domElement.classList.remove("invalidValue");
    } else {
      this.domElement.classList.add("invalidValue");
    }
  }

  private updateValue(val: string) {
    const asNumber = Number(val);
      if (Number.isNaN(asNumber)) {
        this.value = undefined;
        this.setValidityState(false);
      } else {
        this.value = asNumber;
        this.setValidityState(true);
      }
      this.listeners.forEach( e => e(this.value))
  }

  constructor(elementId: string){
    const element = document.getElementById(elementId)
    if(!element) {
      throw new Error("Element not found");
    }
    this.domElement = element as HTMLInputElement
    this.domElement.addEventListener("change", (ev) => {
      const val = (ev.target as HTMLInputElement).value;
      this.updateValue(val)
    })
    const inputText = this.domElement.value
    this.updateValue(inputText)
  }
}


const fromLat = new InputState("fromlat");
const fromLong = new InputState("fromlong");
const toLat = new InputState("tolat");
const toLong = new InputState("tolong");

const allInputs = [fromLat, fromLong, toLat, toLong]

const outputDom = document.getElementById("output")!

function updateState() {
  // check if we have a valid state
  const values = allInputs.map( e => e.getValue()) as [number, number, number, number]
  let valueToWrite = "--.--"
  if( values.some( e => e === undefined)) {
    // invalid state
    
  } else {
    // there are not values undefined at this point
    const heading = calculateHeading(...values)
    valueToWrite = heading.toLocaleString()

  }
  outputDom.innerText = valueToWrite
}

// if any value changes, do an update
allInputs.forEach(e => e.addListener( (_) => updateState()))


// Do an Update on Startup
updateState()