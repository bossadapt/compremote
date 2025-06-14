import { RecieverStatus } from '@/helpers/sharedInterfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

class RecieverState {
  status: RecieverStatus
  roomKey: string
  //does not contain history prior to conenction
  requestHistory: { type: string; desc: string }[]
  constructor() {
    this.status = RecieverStatus.OFFLINE
    this.roomKey = ''
    this.requestHistory = []
  }
}
export const useRecieverStore = defineStore('reciever', () => {
  const bridgeState = ref<RecieverState>(new RecieverState())
  let ws: WebSocket | null = null

  function connect() {
    // Change the URL to match your backend server
    ws = new WebSocket('ws://localhost:8001') // or ws://your-server:8001

    ws.onopen = () => {
      console.log('Connected to RecieverServer')
    }

    ws.onmessage = (event) => {
      console.log('recieved message from backend:', event.data)
      const data = JSON.parse(event.data)
      switch (data.type) {
        //response to initial connection
        case 'stateResponse': {
          bridgeState.value.status = data.status
          bridgeState.value.roomKey = data.roomKey
          break
        }
        //response to command start(when the server sends room key)//DONE
        case 'bridgeAwaiting': {
          bridgeState.value.status = RecieverStatus.AWAITING_CONNECTION
          bridgeState.value.roomKey = data.roomKey
          break
        }
        //response to user joining bridge from rest API side //DONE
        case 'bridgeActive': {
          bridgeState.value.status = RecieverStatus.ACTIVE
          bridgeState.value.roomKey = ''
          break
        }
        //response to command end / error //DONE
        case 'bridgeOffline': {
          bridgeState.value.status = RecieverStatus.OFFLINE
          bridgeState.value.roomKey = ''
          break
        }
        //response remote api requests: play,actions, unkownMessage//DONE
        case 'newRequest': {
          bridgeState.value.requestHistory.push(data.request)
          break
        }
      }
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      ws = null
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
  }

  function sendCommand(command: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ req: command }))
    }
  }
  function startBridge() {
    console.log('start bridge called')
    sendCommand('start')
  }
  function stopBridge() {
    console.log('disable bridge called')
    sendCommand('stop')
  }

  return {
    bridgeState,
    connect,
    startBridge,
    stopBridge,
  }
})
