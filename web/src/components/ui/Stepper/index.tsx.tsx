import clsx from 'clsx';

type StepperProps = {
  steps: string[]
  currentStep: number
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div>
      <h2 className="sr-only">Steps</h2>
      <div
        className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100"
      >
        <ol
          className="relative z-10 flex justify-between text-sm font-medium text-gray-500"
        >
          {steps.map((step, index) => {
            const isActive = index + 1 === currentStep
            return (
              <li key={index} className="flex items-center bg-slate-200 p-2">
                <span
                  className={clsx("h-6 w-6 rounded-full bg-slate-100 text-center text-[10px] font-bold leading-6", {
                    "!bg-indigo-600 text-white": isActive,
                  })}
                >
                  {index + 1}
                </span>
  
                <span className="hidden sm:ml-2 sm:block text-slate-500">{step}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}