import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "@inertiajs/react";

import { PrefetchedLink } from "@/components/navigation/prefetched-link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categoriesUrl } from "@/lib/navigation/urls";
import type { CategoryFormValues } from "@/types/category";

const initialValues: CategoryFormValues = {
    code: "",
    name: "",
    description: "",
};

export function CategoryForm() {
    const { data, setData, post, processing, errors } =
        useForm<CategoryFormValues>(initialValues);

    return (
        <Card>
            <CardHeader className="border-b border-slate-100">
                <CardTitle>Category information</CardTitle>
                <CardDescription>
                    Add a code and name to organize products in your catalog.
                </CardDescription>
            </CardHeader>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    post(categoriesUrl());
                }}
            >
                <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                            label="Code"
                            required
                            hint="Must be unique"
                            error={errors.code}
                        >
                            <Input
                                value={data.code}
                                onChange={(event) =>
                                    setData("code", event.target.value)
                                }
                                placeholder="e.g. ACC"
                            />
                        </Field>
                        <Field label="Name" required error={errors.name}>
                            <Input
                                value={data.name}
                                onChange={(event) =>
                                    setData("name", event.target.value)
                                }
                                placeholder="e.g. Accessories"
                            />
                        </Field>
                        <Field
                            label="Description"
                            className="sm:col-span-2"
                            error={errors.description}
                        >
                            <Textarea
                                value={data.description}
                                onChange={(event) =>
                                    setData("description", event.target.value)
                                }
                                placeholder="Add an optional description..."
                            />
                        </Field>
                    </div>
                </CardContent>
                <CardFooter className="justify-between border-t border-slate-100 bg-slate-50/50 p-6 sm:px-8">
                    <Button type="button" variant="ghost" asChild>
                        <PrefetchedLink
                            href={categoriesUrl()}
                            pageName="Category/Index"
                        >
                            <ArrowLeft aria-hidden="true" />
                            Cancel
                        </PrefetchedLink>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        <Save aria-hidden="true" />
                        Save category
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
