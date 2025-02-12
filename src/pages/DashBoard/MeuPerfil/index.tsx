import { useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldError,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Pencil, User } from "phosphor-react"; // Ícone de usuário do phosphor

// Esquemas de validação
const personalSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(11, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido"),
});

const addressSchema = z.object({
  country: z.string().min(1, "País é obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Pelo menos um número")
      .regex(/[\W_]/, "Pelo menos um caractere especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

// Tipo unificado para o formulário
type FormData = z.infer<
  typeof personalSchema & typeof addressSchema & typeof passwordSchema
>;

export function MeuPerfil() {
  const [activeTab, setActiveTab] = useState<"dados" | "endereco" | "senha">(
    "dados"
  );
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState<string>(
    localStorage.getItem("profileAvatar") || ""
  );
  const [addresses, setAddresses] = useState<z.infer<typeof addressSchema>[]>(
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(
      activeTab === "dados"
        ? personalSchema
        : activeTab === "endereco"
          ? addressSchema
          : passwordSchema
    ),
    mode: "onBlur",
  });

  // Função para upload de foto de perfil
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageData = event.target.result.toString();
          setAvatar(imageData);
          // Armazena no localStorage e atualiza o menu
          localStorage.setItem("profileAvatar", imageData);
          // Dispara evento para sincronização imediata
          window.dispatchEvent(new Event("storage"));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para buscar CEP e preencher os campos
  const handleCEP = async (cep: string) => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      setValue("state", data.uf);
      setValue("city", data.localidade);
      setValue("street", data.logradouro);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Função para submeter o formulário
  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (activeTab === "endereco") {
      setAddresses([...addresses, data as z.infer<typeof addressSchema>]);
      reset();
    }
    setEditMode(false);
  };

  // Componente InputField com tipagem correta
  interface InputFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: FieldError;
    name: Path<FormData>;
    registerOptions?: RegisterOptions<FormData, Path<FormData>>;
    className?: string;
  }

  const InputField = ({
    label,
    error,
    name,
    registerOptions,
    className = "",
    ...props
  }: InputFieldProps) => (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 border rounded-md transition-colors duration-200 focus:ring-2 focus:ring-[#B3B792] focus:border-[#B3B792] ${
          props.disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "hover:border-[#B3B792]"
        } ${className}`}
        {...register(name, registerOptions)}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
      {/* Cabeçalho com foto de perfil */}
      <div className="text-center mb-6 relative">
        <div className="relative inline-block">
          {/* Área da imagem (não clicável) */}
          <div className="cursor-default">
            {" "}
            {/* Alterado de cursor-pointer para cursor-default */}
            {avatar ? (
              <img
                src={avatar}
                alt="Foto de perfil"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-gray-200 hover:border-[#B3B792] transition-all"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-gray-200 hover:border-[#B3B792] transition-all flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Ícone de edição (lápis) - único elemento clicável */}
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Pencil size={20} className="text-gray-600" />
          </label>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex flex-wrap justify-center gap-2 mb-6">
        <TabButton
          active={activeTab === "dados"}
          onClick={() => {
            setActiveTab("dados");
            reset();
            setEditMode(false);
          }}
        >
          Dados Pessoais
        </TabButton>
        <TabButton
          active={activeTab === "endereco"}
          onClick={() => {
            setActiveTab("endereco");
            reset();
            setEditMode(false);
          }}
        >
          Endereço
        </TabButton>
        <TabButton
          active={activeTab === "senha"}
          onClick={() => {
            setActiveTab("senha");
            reset();
            setEditMode(false);
          }}
        >
          Senha
        </TabButton>
      </nav>

      {/* Formulário principal */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {activeTab === "dados" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nome completo"
              name="fullName"
              error={errors.fullName}
              disabled={!editMode}
            />
            <InputField
              label="Data de nascimento"
              type="date"
              name="birthDate"
              error={errors.birthDate}
              disabled={!editMode}
            />
            <InputField
              label="E-mail"
              type="email"
              name="email"
              error={errors.email}
              disabled={!editMode}
            />
            <InputField
              label="Telefone"
              name="phone"
              error={errors.phone}
              disabled={!editMode}
            />
            <div className="md:col-span-2">
              <InputField
                label="CPF"
                name="cpf"
                error={errors.cpf}
                disabled={!editMode}
              />
            </div>
          </div>
        )}

        {activeTab === "endereco" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="CEP"
                name="cep"
                onBlur={(e) => handleCEP(e.target.value)}
                error={errors.cep}
                disabled={!editMode}
              />
              <InputField
                label="País"
                name="country"
                error={errors.country}
                disabled={!editMode}
              />
              <InputField
                label="Estado"
                name="state"
                error={errors.state}
                disabled={!editMode}
              />
              <InputField
                label="Cidade"
                name="city"
                error={errors.city}
                disabled={!editMode}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Rua"
                  name="street"
                  error={errors.street}
                  disabled={!editMode}
                />
              </div>
              <InputField
                label="Número"
                name="number"
                error={errors.number}
                disabled={!editMode}
              />
              <InputField
                label="Complemento"
                name="complement"
                disabled={!editMode}
              />
            </div>

            {addresses.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-gray-700">Endereços salvos:</h3>
                {addresses.map((address, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                      {address.street}, {address.number} - {address.city}/
                      {address.state}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "senha" && (
          <div className="space-y-4 w-full lg:w-[500px]">
            <InputField
              label="Senha atual"
              type="password"
              name="currentPassword"
              error={errors.currentPassword}
              disabled={!editMode}
              className="py-2 w-full"
            />
            <InputField
              label="Nova senha"
              type="password"
              name="newPassword"
              error={errors.newPassword}
              disabled={!editMode}
              className="py-2 w-full"
            />
            <InputField
              label="Confirmar senha"
              type="password"
              name="confirmPassword"
              error={errors.confirmPassword}
              disabled={!editMode}
              className="py-2 w-full"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          {!editMode ? (
            <Button type="button" onClick={() => setEditMode(true)}>
              Editar
            </Button>
          ) : (
            <>
              <Button type="submit" variant="primary">
                Salvar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditMode(false);
                  reset();
                }}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

// Componente Button com tipagem correta e cores atualizadas
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "default";
}

const Button = ({ children, variant = "default", ...props }: ButtonProps) => (
  <button
    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
      variant === "primary"
        ? "bg-[#E5D2B8] hover:bg-[#d1baaa] text-gray-800"
        : variant === "secondary"
          ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
          : "bg-white hover:bg-gray-50 border border-gray-300 text-gray-700"
    }`}
    {...props}
  >
    {children}
  </button>
);

// Componente TabButton com tipagem correta e ajustes para responsividade
interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

const TabButton = ({ active, children, ...props }: TabButtonProps) => (
  <button
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      active ? "bg-[#E5D2B8] text-gray-800" : "text-gray-600 hover:bg-gray-100"
    }`}
    {...props}
  >
    {children}
  </button>
);
