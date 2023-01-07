import clsx from "clsx";
import { useMemo } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FiTrash, FiUploadCloud } from "react-icons/fi";

type FileUploadProps = {
  acceptedTypes: Accept
  maxFiles?: number
  maxSize: number;
  onDrop: (acceptedFiles: File[]) => void;
  withPreview?: boolean;
  submittedFiles?: File[];
  error?: string;
  isMultiple?: boolean;
  onRemove?: (index: number) => void;
}

export const FileUpload = ({ acceptedTypes, maxSize, maxFiles = 1, onDrop, submittedFiles, error, withPreview, isMultiple, onRemove }: FileUploadProps) => {
  const hasError = !!error;

  const isDisabled = submittedFiles && submittedFiles?.length >= maxFiles;

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles,
    maxSize,
    multiple: isMultiple,
    disabled: isDisabled
  });

  const supportedTypesText = useMemo(() => {
    return Object.keys(acceptedTypes).map((format) => format.split("/")[1].toUpperCase()).join(', ');
  }, [acceptedTypes])

  const previewArray = useMemo(() => {
    if (submittedFiles) {
      return submittedFiles.map((file) => URL.createObjectURL(file))
    }
  }, [submittedFiles])

  const limitText = `Tamanho máximo de ${Math.round(maxSize / 1000000)}MB por arquivo. Máximo de ${maxFiles} arquivo(s).`

  return (
    <>
      <div className={clsx("w-full cursor-pointer border-slate-200 bg-slate-100 border text-center py-4 rounded text-slate-600 transition-colors hover:border-indigo-500", {
        "!border-red-400 text-red-400": hasError || isDragReject,
        "opacity-80 hover:!border-red-400 !cursor-not-allowed": isDisabled
      })}>
        <div className="justify-center items-center flex flex-col" {...getRootProps()}>
          <FiUploadCloud size={35} />
          <span className="py-2">
            <input type="file" {...getInputProps()} />
            {isDragActive ? (
              isDragReject ? (
                <p className="text-red font-semiBold">Formato não aceito</p>
              ) : (
                <p className="font-semiBold">Solte o arquivo aqui...</p>
              )
            ) : (
              <p className="text-charcoal font-semiBold">
                Arraste e solte ou clique para selecionar
              </p>
            )}
          </span>
          <p className="text-xs text-slate-500 font-light">{limitText}</p>
          <p className="text-xs text-slate-500 font-light">
            {`Formatos aceitos: ${supportedTypesText}`}
          </p>
        </div>
      </div>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error}</span>
      )}

      {withPreview && onRemove && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2 mt-4">
          {previewArray?.map((file, index) => (
            <div key={`preview-${index}`} className="relative">
              <button onClick={() => onRemove(index)} type="button" className="bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center text-slate-600 bottom-2 right-2 absolute hover:bg-indigo-500 hover:text-white transition-colors">
                <FiTrash size={20} />
              </button>
              <img className="w-full h-[100px] rounded object-cover overflow-hidden bg-slate-300 border border-slate-400" src={file} />
            </div>
          ))}

          {Array.from({ length: maxFiles - (submittedFiles?.length || 0) }).fill("").map((_, index) => (
            <div key={`preview-placeholder-${index}`} className="w-full h-[100px] rounded bg-slate-200" />
          ))}
        </div>
      )}
    </>
  )
}