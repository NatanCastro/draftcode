'use client'

import React from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useToast } from '@components/ui/use-toast'
import { ProjectSchemaCreate } from '@/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectFormInput } from '../ProjectFormInput'
import { ProjectFormTextarea } from '../ProjectFormTextarea'

type ProjectData = z.infer<typeof ProjectSchemaCreate>

const BACKEND_UPLOAD_URL = process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL

export const ProjectFormCreate: React.FC = () => {
	const { toast } = useToast()
	const [loading, setLoading] = React.useState(false)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm<ProjectData>({
		resolver: zodResolver(ProjectSchemaCreate)
	})

	const image = watch('image')

	const onSubmit = async (data: ProjectData) => {
		const formData = new FormData()

		formData.append('image', data.image[0])

		try {
			setLoading(true)
			const responseImage = await fetch(`${BACKEND_UPLOAD_URL}/image-upload`, {
				method: 'POST',
				body: formData
			})
			const imageJson = (await responseImage.json()) as { url: string; public_id: string }

			const project = {
				...data,
				image: imageJson.url,
				image_id: imageJson.public_id
			}

			const responseProject = await fetch('/api/project', {
				method: 'POST',
				body: JSON.stringify(project)
			})

			await responseProject.json()

			toast({
				title: 'Projeto criado com sucesso',
				description: 'Seu projeto foi criado com sucesso'
			})

			setLoading(false)
			reset()
		} catch (error) {
			setLoading(false)
			toast({
				variant: 'destructive',
				title: 'Erro ao criar projeto',
				description: 'Verifique os campos e tente novamente'
			})
		}
	}

	React.useEffect(() => {
		if (Object.entries(errors).length > 0) {
			toast({
				variant: 'destructive',
				title: 'Erro ao criar projeto',
				description: errors[Object.keys(errors)[0] as keyof typeof errors]?.message
			})
		}
	}, [errors, toast])

	return (
		<>
			{loading && (
				<div className='fixed inset-0 z-50 flex items-center justify-center'>
					<div className='absolute inset-0 bg-background opacity-80' />
					<div className='relative'>
						<div className='rounded-lg border border-border bg-[#1F1F1F] p-10 text-foreground'>
							<h1 className='text-2xl font-bold'>
								Criando Projeto
								<ReloadIcon className='ml-2 inline-block h-6 w-6 animate-spin' />
							</h1>
							<p className='mt-5'>Aguarde enquanto seu projeto é criado.</p>
						</div>
					</div>
				</div>
			)}
			<form onSubmit={handleSubmit(onSubmit)} className='container'>
				<div className='mb-10 gap-10 md:flex'>
					<div className='hidden w-full max-w-xs md:block'>
						<h3 className='text-2xl font-bold leading-[46px]'>Nome, Linguagem e Nível</h3>
						<p>Insira o nome do desafio, sua linguagem e nível requerido</p>
					</div>
					<div className='flex-1'>
						<ProjectFormInput
							htmlFor='nome-desafio'
							type='text'
							label='Nome do Desafio'
							placeholder='Nome do Desafio'
							helperText='Escolha um nome para o desafio entre 6 e 45 caracteres'
							{...register('title')}
						/>

						<div className='flex gap-5'>
							<ProjectFormInput
								htmlFor='linguagem-desafio'
								type='text'
								label='Linguagem'
								placeholder='Linguagens'
								helperText='Escolha uma ou mais linguagens para o desafio separadas por espaço'
								{...register('technologies')}
							/>

							<ProjectFormInput
								htmlFor='nivel-desafio'
								type='text'
								label='Nível'
								placeholder='Nível'
								helperText='Escolha um nível para o desafio (Iniciante, Intermediário, Avançado)'
								{...register('difficulty')}
							/>
						</div>
					</div>
				</div>

				<div className='mb-10 flex flex-col gap-10 md:flex-row'>
					<div className='hidden w-full max-w-xs md:block'>
						<h3 className='text-2xl font-bold leading-[46px]'>Imagem</h3>
						<p>Insira uma Imagem que mostre a tela final do desafio</p>
					</div>
					<div className='flex-1'>
						<ProjectFormInput
							htmlFor='imagem-desafio'
							type='file'
							label='Imagem do desafio'
							placeholder='Imagem do desafio'
							helperText='Insira uma imagem que demonstre o desafio'
							{...register('image')}
						/>

						{image && image[0] && (
							<img
								src={URL.createObjectURL(image[0])}
								alt='Imagem do desafio'
								className='mt-5 w-full'
							/>
						)}
					</div>
				</div>

				<div className='mb-10 flex flex-col gap-10 md:flex-row'>
					<div className='hidden w-full max-w-xs md:block'>
						<h3 className='text-2xl font-bold leading-[46px]'>Link para o Figma</h3>
						<p>Utilize um link que leve ao figma do desafio para ser utilizado</p>
					</div>

					<ProjectFormInput
						htmlFor='figma-desafio'
						type='text'
						label='Figma'
						placeholder='Link para o Figma'
						helperText='Insira um link para o figma do desafio, deve ser um link válido'
						{...register('figma_url')}
					/>
				</div>

				<div className='mb-10 flex flex-col gap-10 md:flex-row'>
					<div className='hidden w-full max-w-xs md:block'>
						<h3 className='text-2xl font-bold leading-[46px]'>Descrição</h3>
						<p>Insira uma descrição sobre o desafio, informe o objetivo do mesmo</p>
					</div>

					<ProjectFormTextarea
						htmlFor='descricao-desafio'
						label='Descrição'
						placeholder='Neste desafio, você será desafiado a criar um formulário de login responsivo usando HTML, CSS e JavaScript. O formulário deve ter uma aparência agradável em dispositivos de desktop e móveis e deve ser fácil de usar para os usuários.'
						helperText='Insira uma descrição entre 10 e 120 caracteres sobre o desafio, informe o objetivo do mesmo'
						{...register('brief')}
					/>
				</div>

				<div className='mb-10 flex flex-col gap-10 md:flex-row'>
					<div className='hidden w-full max-w-xs md:block'>
						<h3 className='text-2xl font-bold leading-[46px]'>Requisitos</h3>
						<p>
							Informe para os usuarios as tasks que devem ser completadas para finalizar o
							desafio
						</p>
					</div>

					<ProjectFormTextarea
						htmlFor='requisitos-desafio'
						label='Requisitos'
						placeholder='Você deve criar uma interface de usuário para um aplicativo de lista de tarefas simples. Ele deve consistir em um campo de entrada de texto, um botão "Adicionar" e uma lista de tarefas. Cada item da lista deve ter um botão "Excluir" que remova o item da lista. Você deve usar HTML, CSS e JavaScript para este projeto. Você não deve usar bibliotecas ou frameworks.'
						helperText='Informe para os usuarios as tasks que devem ser completadas para finalizar o
					desafio'
						{...register('description')}
					/>
				</div>

				<Button className='mx-auto block w-fit uppercase md:ml-auto md:mr-0'>
					Criar
				</Button>
			</form>
		</>
	)
}
