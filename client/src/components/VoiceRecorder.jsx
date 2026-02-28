import { useState, useRef } from 'react'
import { Mic, Square, Loader2, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { useSelector } from 'react-redux'

function VoiceRecorder({ onTranscription, label = "Voice Input" }) {
    const [isRecording, setIsRecording] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const { user } = useSelector((state) => state.auth)

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
                await handleUpload(audioBlob)
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (err) {
            console.error('Error accessing microphone:', err)
            alert('Could not access microphone. Please check permissions.')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    const handleUpload = async (blob) => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const response = await axios.post('/api/voice/transcribe', formData, config)
            if (response.data.text) {
                onTranscription(response.data.text.trim())
            }
        } catch (error) {
            console.error('Transcription error:', error)
            alert('Failed to transcribe audio. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {!isRecording ? (
                <button
                    type="button"
                    onClick={startRecording}
                    disabled={isLoading}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${isLoading ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                    title="Record voice input"
                >
                    {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Mic size={14} />
                    )}
                    {isLoading ? 'Transcribing...' : label}
                </button>
            ) : (
                <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-600 animate-pulse"
                    title="Stop recording"
                >
                    <Square size={14} fill="currentColor" />
                    Stop Recording
                </button>
            )}
        </div>
    )
}

export default VoiceRecorder
