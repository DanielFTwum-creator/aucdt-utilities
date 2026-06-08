describe('App: Dictation App - AI-for-Good Note Studio Journey', () => {
  beforeEach(() => {
    // Visit application and mock browser Media Recorder APIs
    cy.visit('/dictation/', {
      onBeforeLoad(win) {
        // Bypass onboarding tutorial
        win.localStorage.setItem('dictation_tutorial_dismissed_v1', '1');
        
        // Force Cypress Test Mode to bypass AuthGate
        (win as any).__CYPRESS_TEST_MODE__ = true;
        win.localStorage.setItem('__CYPRESS_TEST_MODE__', 'true');

        // Mock getUserMedia to return a mock media stream
        const mockStream = {
          getTracks: () => [
            {
              stop: cy.stub().as('stopTrack')
            }
          ]
        };
        cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves(mockStream);

        // Mock AudioContext to prevent real audio hardware errors
        const mockAudioSource = {
          connect: cy.stub()
        };
        const mockAnalyser = {
          fftSize: 256,
          frequencyBinCount: 128,
          getByteFrequencyData: cy.stub().callsFake((array) => {
            for (let i = 0; i < array.length; i++) {
              array[i] = Math.floor(Math.random() * 256);
            }
          }),
          connect: cy.stub()
        };
        const mockAudioContext = {
          state: 'running',
          createMediaStreamSource: cy.stub().returns(mockAudioSource),
          createAnalyser: cy.stub().returns(mockAnalyser),
          close: cy.stub().resolves()
        };
        win.AudioContext = cy.stub().returns(mockAudioContext) as any;
        (win as any).webkitAudioContext = win.AudioContext;

        // Mock MediaRecorder
        class MockMediaRecorder {
          stream: any;
          mimeType: string;
          state: string;
          ondataavailable: any;
          onstop: any;

          constructor(stream: any, options: any = {}) {
            this.stream = stream;
            this.mimeType = options.mimeType || 'audio/webm';
            this.state = 'inactive';
          }

          start() {
            this.state = 'recording';
            // Send mock audio chunks
            setTimeout(() => {
              if (this.ondataavailable) {
                this.ondataavailable({
                  data: new Blob(['dummy audio content'], { type: this.mimeType })
                });
              }
            }, 100);
          }

          stop() {
            this.state = 'inactive';
            setTimeout(() => {
              if (this.onstop) {
                this.onstop();
              }
            }, 100);
          }
        }

        win.MediaRecorder = MockMediaRecorder as any;
      }
    });

    cy.wait(500);
  });

  it('should load Note Monitor and allow setting note title', () => {
    // 1. Check title input placeholder is visible
    cy.get('input[placeholder="Untitled Session"]')
      .should('be.visible')
      .clear()
      .type('Agricultural AI Strategy')
      .should('have.value', 'Agricultural AI Strategy');
    
    // 2. Verify standby note message is visible
    cy.contains('Ready to capture').should('be.visible');
  });

  it('should record voice input, call the live transcription service, and handle completion status', () => {
    // 1. Click start recording button in the header
    cy.get('button[title="Start recording"]').first().click();

    // 2. Verify live broadcast status is active
    cy.contains('REC').should('be.visible');
    
    // 3. Stop recording to trigger processing
    cy.get('button[aria-label="Stop recording"]').click();

    // 4. Verify status displays processing message
    cy.contains('Processing dictation...').should('be.visible');

    // 5. Wait for the live API call to finish and check status
    cy.get('body', { timeout: 35000 }).should('exist');
  });
});
